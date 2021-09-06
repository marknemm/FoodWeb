import { Component, Directive, forwardRef, Input, OnChanges, OnDestroy, Provider, SimpleChange, SimpleChanges, Type } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { TAbstractControl, UpdateValueOptions } from '~web/forms/classes/t-abstract-control';
import { TFormArray } from '~web/forms/classes/t-form-array';
import { TFormControl } from '~web/forms/classes/t-form-control';
import { TFormGroup } from '~web/forms/classes/t-form-group';
import { DeriveAbstractControl, DeriveAbstractControlType, DeriveFormArrayType, DeriveFormControlType, DeriveFormGroupType } from '~web/forms/interfaces/template-type-util';
import { FormHelperService } from '~web/forms/services/form-helper/form-helper.service';

/**
 * Base class that implements fundamental ControlValueAccessor functionality.
 * It also initializes a `TAbstractControl` (e.g. `TFormArray`, `TFormControl`, or `TFormGroup`)
 * based off of input bindings that are set on the derived component.
 * NOTE: This is the private version used to encapsulate template types that are derived. See the public version below.
 * @param T The type of this component's raw data or its contained `AbstractControl`.
 * If set to a raw data type, then the AbstractControl type will default to `TFormControl<T>`.
 * If set to `TFormArray`, `TFormControl`, or `TFormGroup`, then the AbstractControl will be set accordingly.
 * @param V The type of this component's raw form data. Defaults to `T` if it is a raw value type.
 * Otherwise, extracts the `TAbstractControl` template type set for `T`.
 * @param A The type of this component's `AbstractControl`. Defaults to `T` if it is a `TAbstractControl`.
 * Otherwise, `T` is assumed to be a raw value, and this parameter will default to `TFormControl<T>`.
 * @param FG The type of this component's `fromGroup`. Defaults to `A` if A extends `TFormGroup<T>`.
 * @param FA The type of this component's `formArray`. Defaults to `A` if A extends `TFormArray<ExtractArrayType<T>>`.
 * @param FC The type of this component's `formControl`. Defaults to `A` if A extends `TFormControl<T>`.
 */
@Directive() // eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class _FormBaseComponent<
  T, // Can be a raw value or some AbstractControl type.
  V                                               = DeriveAbstractControlType<T>,
  A extends TAbstractControl<V>                   = DeriveAbstractControl<T, V>,
  FG extends TFormGroup<V>                        = DeriveFormGroupType<V, A>,
  FA extends TFormArray<any, ExtractArrayType<V>> = DeriveFormArrayType<V, A>,
  FC extends TFormControl<V>                      = DeriveFormControlType<V, A>
> implements OnChanges, OnDestroy, ControlValueAccessor {

  /**
   * A flag that determines if this component should currently be editable, or display only.
   */
  @Input() editable = false;

  /**
   * The value of the contained active `TAbstractControl`.
   * Any changes to this input data will result in an update to the abstract control's raw value, and vice-versa.
   */
  @Input() value: V;

  // These inputs are used in conjunction with the FormHelper service to lookup `AbstractControl` instances by name,
  // which are present within a `FormGroup` that is bound to an encompassing `[formGroup]` or `formGroupName` directive
  // in the surrounding HTML.
  @Input() formArrayName = '';
  @Input() formControlName = '';
  @Input() formGroupName = '';

  // These inputs are an alternative to the 'name' version, where the `AbstractControl` is passed directly in.
  @Input() formArray: FA;
  @Input() formControl: FC;
  @Input() formGroup: FG;

  /**
   * A flag that turns on debug mode logging when set to true.
   */
  @Input() debugMode = false;
  /**
   * A special name given to this FormBaseComponent instance, which will be displayed in all debug log messages.
   */
  @Input() debugName = '';

  protected _destroy$ = new Subject();

  private _abstractCtrlDerivedFromInputs = false;
  private _ngOnChangesInvoked = false;
  private _prevAbstractCtrl: A;
  private _valueChangeSubscription = new Subscription();
  private _valuePropertyInputs: (keyof V)[] = [];
  private _onChangeCb: (value: V) => void = () => {};
  private _onTouchedCb = () => {};

  /**
   * @param _defaultCtrlInit A lazy initializer function for the default `TAbstractControl` that is to be used if no from
   * control input bindings are set. Will be invoked within the first call to the ngOnChanges function.
   * (e.g. `formArray`, `formArrayName`, `formControl`, `formControlName`, `formGroup`, and `formGroupName` inputs are all falsy)
   * @param _formHelperService The `FormHelperService` provided by the derived component, via `formProvider()`,
   * which is used to get instances of abstract controls from their names (e.g. `formArrayName`, `formControlName`, or `formGroupName`).
   * @param initImmediately Optionally set to true if the contained `TAbstractControl` should be default initialized immediately.
   * Otherwise, it will be initialized within the `ngOnChanges` hook. Note, top-level routable components MUST set this to true.
   */
  constructor(
    protected _defaultCtrlInit: () => A,
    protected _formHelperService: FormHelperService,
    initImmediately = false
  ) {
    if (initImmediately) {
      this._initDefaultAbstractControl();
    } else {
      // Prevent hard to debug error that occurs when ngOnChanges has been overriden without calling super in a subclass!
      setTimeout(() => {
        if (!this._ngOnChangesInvoked) {
          throw new Error('ngOnChanges has an override in a subclass that does not call `super.ngOnChanges(changes)`.')
        }
      }, 100); // 100 so hopefully shows as last error in console output.
    }
  }

  /**
   * The active `TAbstractControl` derived within this form component base;
   * either a `TFormArray`, `TFormControl`, or `TFormGroup`.
   * @throws An error when accessed if an abstract control was never set on this component.
   */
  get activeAbstractControl(): A {
    return <any>(
      (this.formGroup)
        ? this.formGroup
        : (this.formArray)
            ? this.formArray
            : this.formControl
    );
  }

  /**
   * Whether or not the derived `TAbstractControl` was derived from a component input binding.
   * (e.g. `formArray`, `formArrayName`, `formControl`, `formControlName`, `formGroup`, or `formGroupName`).
   */
  get abstractCtrlDerivedFromInputs(): boolean {
    return this._abstractCtrlDerivedFromInputs;
  }

  /**
   * Whether or not this `FormBaseComponent` has an initialized `TAbstractControl`
   * (e.g. `formArray`, `formControl`, or `formGroup` is truthy).
   */
  get hasAbstractControl(): boolean {
    return !!(this.formArray || this.formControl || this.formGroup);
  }

  /**
   * The current raw value of the contained `TAbstractControl`. If no such control is setup, then undefined.
   * Note that this value will contain any disabled elements or properties for a `TFormArray` or `TFormGroup`.
   * @return The current raw value.
   */
  getRawValue(): V {
    return (this.hasAbstractControl)
      ? (this.activeAbstractControl instanceof FormControl)
        ? this.activeAbstractControl.value
        : (<any>this.activeAbstractControl).getRawValue()
      : undefined;
  }

  /**
   * Registers input binding fields that are to be synchronized with corresponding `value` properties on change (vice-versa).
   * @param inputFields A list of input binding field names to be synchronized with corresponding `value` properties.
   */
   keepValuePropertyInputSync(inputFields: (keyof V)[]): void {
    this._valuePropertyInputs = inputFields;
  }

  /**
   * The registered on change callback function that should be invoked with the updated value whenever a change is registered.
   * @param value The updated value.
   */
  get onChangeCb(): (value: V) => void {
    return this._onChangeCb;
  }

  /**
   * The registered on touched callback function that should be invoked whenever the contained form control is blurred.
   */
  get onTouchedCb(): () => void {
    return this._onTouchedCb;
  }

  /**
   * On input binding changes (including initialization), derives the `TAbstractControl` that is to be used.
   * If no such abstract control can be derived from the updated state of input values, then the default one is used.
   * Also, synchronizes the `value` input with the current raw value of the derived active abstract control and vice-versa.
   * @param changes The detected simple input binding changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    this._ngOnChangesInvoked = true;
    this._debugLog('Input changes detected', changes);
    const isAbstractCtrlChange = !!(
      changes.formControlName || changes.formControl
      || changes.formArrayName || changes.formArray
      || changes.formGroupName || changes.formGroup
    );

    // If an input was set which can be used to derive the contained abstract control, then attempt to derive.
    if (isAbstractCtrlChange) {
      this._deriveAbstractControlFromInputs();
    }

    // If no abstract control has been derived, then use the default control that was supplied as a constructor argument.
    if (!this.hasAbstractControl) {
      this._initDefaultAbstractControl();
    }

    // Based off of change to value input and/or abstract control input(s),
    // synchronize the data in the value input with the raw value in the active abstract control.
    if (this.hasAbstractControl) {
      this._syncValueWithAbstractControl(changes.value);
    }
    this._syncValuePropertyInputs(changes);
  }

  /**
   * Derives the active abstract control from associated component inputs.
   * Examples of such inputs are `formArray`, `formArrayName`, `formControl`, `formControlName`, `formGroup`, and `formGroupName`.
   */
  private _deriveAbstractControlFromInputs(): void {
    this.formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this.formGroup);
    this.formArray = this._formHelperService.deriveAbstractControl(this.formArrayName, this.formArray);
    this.formControl = this._formHelperService.deriveAbstractControl(this.formControlName, this.formControl);
    this._abstractCtrlDerivedFromInputs = !!(this.formGroup || this.formArray || this.formControl);
    this.hasAbstractControl
      ? this._debugLog('Derived abstract control from component inputs', this.activeAbstractControl)
      : this._debugLog('Could not derive abstract control from component inputs');
  }

  /**
   * Initializes the active `TAbstractControl` to the default one which was supplied via a constructor argument.
   */
  private _initDefaultAbstractControl(): void {
    const defaultCtrl: A = this._defaultCtrlInit ? this._defaultCtrlInit() : <any>new TFormControl();
    if (defaultCtrl instanceof FormArray) {
      this.formArray = <any>defaultCtrl;
      this._debugLog('Initialized default FormArray', this.formArray);
    } else if (defaultCtrl instanceof FormControl) {
      this.formControl = <any>defaultCtrl;
      this._debugLog('Initialized default FormControl', this.formControl);
    } else if (defaultCtrl instanceof FormGroup) {
      this.formGroup = <any>defaultCtrl;
      this._debugLog('Initialized default FormGroup', this.formGroup);
    }
  }

  /**
   * Synchronizes the `value` component input with the raw value present in the contained active `TAbstractControl`.
   * Also, monitors for changes in the active abstract control, and propegates any changes to the value component input.
   *
   * Note that any changes to the value component input will propegate to the active abstract control
   * via the `ngOnChanges` component lifecycle hook.
   */
  private _syncValueWithAbstractControl(valueChange: SimpleChange): void {
    // If the value component input is updated or initialized with non-null data, propegate the change to the set abstract control.
    if (valueChange && (!valueChange.firstChange || this.value != null)) {
      this.activeAbstractControl.patchValue(this.value, { emitEvent: false });
      this._debugLog('Set abstract control to the currently bound value input', this.activeAbstractControl.value);
    }

    // If the contained abstract control has been updated, then sync the value component input with its raw value
    if (this.activeAbstractControl !== this._prevAbstractCtrl) {
      this._prevAbstractCtrl = this.activeAbstractControl;
      this.value = this.activeAbstractControl.value;

      // Listen for any future changes to the abstract control's value, and sync the value component input with it.
      this._valueChangeSubscription.unsubscribe(); // Ensure we cleanup previous subscription if form control has changed.
      this._valueChangeSubscription = this.onValueChanges().subscribe((value: V) => {
        this.value = value;
        this._debugLog('Set the value input to the current value of the contained abstract control', this.value);
        // If the abstract control is not being directly passed in or derived via input binding,
        // then must go through traditional means to propegate form change to model (e.g. [(ngModel)] binding is used).
        if (!this.abstractCtrlDerivedFromInputs) {
          this.onChangeCb(value);
          this._debugLog('Invoking onChangeCb with value', this.value);
        }
      });
    }
  }

  /**
   * Synchronizes the `value` input with the component input bindings that are also properties within the value object.
   * Individual input binding properties take precedence over the value binding.
   * @param changes The simple chagnes that have been detected in the component input bindings.
   */
  private _syncValuePropertyInputs(changes: SimpleChanges): void {
    if (!this._valuePropertyInputs?.length) return;
    const hasValueChange = !!(changes.value && (!changes.value.firstChange || this.value));
    this._debugLog('Syncing value input binding fields: ', this._valuePropertyInputs);

    for (const inputFieldName of this._valuePropertyInputs) {
      const inputFieldChange: SimpleChange = changes[<string>inputFieldName];
      if (inputFieldChange && (!inputFieldChange.firstChange || inputFieldChange.currentValue)) {
        this._debugLog(`Setting value.${inputFieldName} to the ${inputFieldName} input binding value: `, inputFieldChange.currentValue);
        this.value[inputFieldName] = inputFieldChange.currentValue;
      } else if (hasValueChange) {
        this._debugLog(`Setting ${inputFieldName} input binding value to value.${inputFieldName}: `, this.value[inputFieldName]);
        this[<string>inputFieldName] = this.value[inputFieldName];
      }
    }

    if (this.hasAbstractControl) {
      this.activeAbstractControl.patchValue(this.value, { emitEvent: false });
    }
  }

  /**
   * A convenience method for outputting debug log messages.
   * @param messages The message(s) that are to be logged.
   */
  private _debugLog(...messages: any[]): void {
    if (this.debugMode) {
      for (const message of messages) {
        if (typeof message === 'string') {
          const debugStart: string = this.debugName ? `${this.debugName}:: ` : '';
          console.log(`${debugStart}${message}`);
        } else {
          console.log(message);
        }
      }
    }
  }

  /**
   * On component destroy, calls next on the `_destroy$` subject so that all observables with `takeUntil(this._destroy$)` are completed.
   */
  ngOnDestroy() {
    this._destroy$.next(); // Cleanup form related RxJS subscriptions.
    if (this.activeAbstractControl?.destroy) {
      this.activeAbstractControl.destroy();
    }
  }

  /**
   * @override
   * A default implementation of the `ControlValueAccessor` interface's writeValue signature.
   * Used by the native Angular Forms module to write a value to this component's internal `AbstractControl`.
   *
   * Note, this should NOT be called directly, and is only intended for use by the native framework.
   * Instead, set the value directly on the control itself.
   * @param value The value to write.
   * @param options Options for the write operation (See AbstractControl.setValue for more details).
   */
  writeValue(value: V, options?: UpdateValueOptions): void {
    // Only set the underlying control's value if it was not supplied via an input binding.
    // If it was set via an input binding, then external changes to the passed in control's value will automatically be applied.
    if (!this.abstractCtrlDerivedFromInputs) {
      this.activeAbstractControl.setValue(value, options);
      this._debugLog('Set the value of the contained abstract control', value, options);
    }
  }

  /**
   * @override
   * Registers a given on change callback function, which should be invoked whenever a change is detected in the
   * underlying active abstract control; either `formArray`, `formControl`, or `formGroup`.
   * @param onChangeCb The on change callback function.
   */
  registerOnChange(onChangeCb: (value: V) => void): void {
    this._onChangeCb = onChangeCb;
  }

  /**
   * @override
   * Registers a given on touched callback function, which should be invoked whenever a blur event is detected
   * in the underlying view element.
   * @param onTouchedCb The on touched callback function.
   */
  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  /**
   * @override
   * A default implementation of the `ControlValueAccessor` interface's writeValue signature.
   * Used by the native Angular Forms module to set the disabled state of this component's internal `AbstractControl`.
   *
   * Note, this should NOT be called directly, and is only intended for use by the native framework.
   * Instead, set the disabled state directly on the control itself.
   * @param isDisabled Whether or not disable should be set.
   */
  setDisabledState(isDisabled: boolean): void {
    // Only set the underlying control's disabled state if it was not supplied via an input binding.
    // If it was set via an input binding, then external changes to the passed in control's disabled state will automatically be applied.
    if (!this.abstractCtrlDerivedFromInputs) {
      (isDisabled) ? this.activeAbstractControl.disable() : this.activeAbstractControl.enable();
      this._debugLog(`Set the disabled state of the contained abstract control to ${isDisabled}`);
    }
  }

  /**
   * Gets an observable that immediately emits the current value and listens for value changes to occur within a given abstract control,
   * or the contained active abstract control.
   * @param ctrl The optional abstract control that will be monitored for value changes.
   * If not set, then defaults to this form base component's active abstract control.
   * @return An observable that emits the current value and any additional value changes.
   * Will automatically be unsubscribed from when this component is destroyed.
   */
  monitorValue<P = V>(ctrl: TAbstractControl<P> & AbstractControl = <any>this.activeAbstractControl): Observable<P> {
    return ctrl.valueChanges.pipe(
      startWith(ctrl.value),
      takeUntil(this._destroy$)
    );
  }

  /**
   * Gets an observable that listens for value changes to occur within a given abstract control,
   * or the contained active abstract control.
   * @param ctrl The optional abstract control that will be monitored for value changes.
   * If not set, then defaults to this form base component's active abstract control.
   * @return An observable that emits any value changes. Will automatically be unsubscribed from when this component is destroyed.
   */
  onValueChanges<P = V>(ctrl: TAbstractControl<P> & AbstractControl = <any>this.activeAbstractControl): Observable<P> {
    return ctrl.valueChanges.pipe(takeUntil(this._destroy$));
  }
}

/**
 * Base class that implements fundamental ControlValueAccessor functionality.
 * It also initializes a `TAbstractControl` (e.g. `TFormArray`, `TFormControl`, or `TFormGroup`)
 * based off of input bindings that are set on the derived component.
 *
 * `IMPORTANT`: Don't forget to add the `fromProvider(...)` method call to the derived component's `providers` array.
 *
 * @param T The type of this component's raw data or its contained `AbstractControl`.
 * If set to a raw data type, then the AbstractControl type will default to `TFormControl<T>`.
 * If set to `TFormArray`, `TFormControl`, or `TFormGroup`, then the AbstractControl will be set accordingly.
 */
@Component({ template: '' })
export abstract class FormBaseComponent<T> extends _FormBaseComponent<T> {}

/**
 * Generates a basic component level providers array containing NG_VALUE_ACCESSOR and FormHelperService providers.
 * @param component The component type.
 * @return The basic component level providers array for components that extend FormBaseComponent.
 */
export function formProvider(component: Type<FormBaseComponent<any>>): Provider[] {
  return [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => component), multi: true },
    FormHelperService
  ];
}
