import { Component, Directive, forwardRef, Input, OnChanges, OnDestroy, Provider, SimpleChanges, Type } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExtractArrayType, ExtractControlType } from '~web/data-structure/generics';
import { TAbstractControl, UpdateValueOptions } from '~web/data-structure/t-abstract-control';
import { TFormArray } from '~web/data-structure/t-form-array';
import { TFormControl } from '~web/data-structure/t-form-control';
import { TFormGroup } from '~web/data-structure/t-form-group';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

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
@Directive()
// tslint:disable-next-line: directive-class-suffix
abstract class _FormBaseComponent<
  T,
  V = ExtractControlType<T>,
  A extends TAbstractControl<V> = T extends TAbstractControl<V> ? T : TFormControl<V>,
  FG extends TFormGroup<V> = A extends TFormGroup<V> ? A : undefined,
  FA extends TFormArray<any, ExtractArrayType<V>> = A extends TFormArray<any, ExtractArrayType<V>> ? A : undefined,
  FC extends TFormControl<V> = A extends TFormControl<V> ? A : undefined
> implements OnChanges, OnDestroy, ControlValueAccessor {

  @Input() formArrayName = '';
  @Input() formControlName = '';
  @Input() formGroupName = '';
  @Input() value: V;
  @Input() set formArray(array: FA) { this._formArray = array; }
  @Input() set formControl(control: FC) { this._formControl = control; }
  @Input() set formGroup(group: FG) { this._formGroup = group; }

  protected _destroy$ = new Subject();

  private _controlInputBound = false;
  private _formArray: FA;
  private _formControl: FC;
  private _formGroup: FG;
  private _prevAbstractCtrl: A;
  private _valueChangeSubscription = new Subscription();
  private _onChangeCb: (value: V) => void = () => {};
  private _onTouchedCb = () => {};

  /**
   * @param _defaultControl The default `TAbstractControl` that is to be used if no from control input bindings are set.
   * (e.g. `formArray`, `formArrayName`, `formControl`, `formControlName`, `formGroup`, and `formGroupName` are all falsy)
   * @param _formHelperService The `FormHelperService` provided by the derived component, via `formProvider()`,
   * which is used to get instances of abstract controls from their names (e.g. `formArrayName`, `formControlName`, or `formGroupName`).
   */
  constructor(
    protected _defaultControl: A,
    protected _formHelperService: FormHelperService,
  ) {}

  /**
   * The active `TAbstractControl` derived within this form component base;
   * either a `TFormArray`, `TFormControl`, or `TFormGroup`.
   * @throws An error when accessed if an abstract control was never set on this component.
   */
  get activeAbstractControl(): A {
    const abstractControl: A = <any>(
      (this._formGroup)
        ? this._formGroup
        : (this._formArray)
            ? this._formArray
            : this._formControl
    );
    if (!abstractControl) {
      throw new Error(
        'FormBaseComponent never initialized its internal form array/control/group. Did you forget to call super.ngOnChanges()?'
      );
    }
    return abstractControl;
  }

  /**
   * Whether or not the derived `TAbstractControl` was supplied as an input binding.
   * (e.g. `formArray`, `formArrayName`, `formControl`, `formControlName`, `formGroup`, or `formGroupName` is truthy).
   */
  get controlInputBound(): boolean {
    return this._controlInputBound;
  }

  /**
   * The `TFormArray` that is set on the component.
   * @throws An error when accessed if the form array was never initialized on the component.
   */
  get formArray(): FA {
    if (!this._formArray) {
      throw new Error('FormBaseComponent never initialized its internal formArray. Did you forget to call super.ngOnChanges()?');
    }
    return this._formArray;
  }

  /**
   * The `TFormControl` that is set on the component.
   * @throws An error when accessed if the form control was never initialized on the component.
   */
  get formControl(): FC {
    if (!this._formControl) {
      throw new Error('FormBaseComponent never intialized its internal formControl. Did you forget to call super.ngOnChanges()?');
    }
    return this._formControl;
  }

  /**
   * The `TFormGroup` that is set on the component.
   * @throws An error when accessed if the form group was never initialized on the component.
   */
  get formGroup(): FG {
    if (!this._formGroup) {
      throw new Error('FormBaseComponent never intialized its internal formGroup. Did you forget to call super.ngOnChanges()?');
    }
    return this._formGroup;
  }

  /**
   * Whether or not this `FormBaseComponent` has an initialized `TAbstractControl`
   * (e.g. `formArray`, `formControl`, or `formGroup` is truthy).
   */
  get hasAbstractControl(): boolean {
    return !!(this._formArray || this._formControl || this._formGroup);
  }

  /**
   * The current raw value of the contained `TAbstractControl`. If no such control is setup, then undefined.
   * Note that this value will contain any disabled elements or properties for a `TFormArray` or `TFormGroup`.
   * @return The current raw value.
   */
  getRawValue(): V {
    return (this.controlInputBound)
      ? (this.activeAbstractControl instanceof FormControl)
        ? this.activeAbstractControl.value
        : (<any>this.activeAbstractControl).getRawValue()
      : undefined;
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
   * @param changes The detected simple input binding changes.
   */
  ngOnChanges(changes: SimpleChanges) {
    const isAbstractCtrlChange = !!(
      changes.formControlName || changes.formControl
      || changes.formArrayName || changes.formArray
      || changes.formGroupName || changes.formGroup
    );

    // If an input was set which can be used to derive the contained abstract control, then attempt to derive.
    if (isAbstractCtrlChange) {
      this._controlInputBound = !!(
        this.formControlName || this._formControl
        || this.formArrayName || this._formArray
        || this.formGroupName || this._formGroup
      );
      this._formControl = this._formControl ? this._formControl : <FC>new TFormControl<V>(); // Set default for fallback if cannot derive.
      this._formGroup = this._formHelperService.deriveAbstractControl(this.formGroupName, this._formGroup);
      this._formArray = this._formHelperService.deriveAbstractControl(this.formArrayName, this._formArray);
      this._formControl = this._formHelperService.deriveAbstractControl(this.formControlName, this._formControl);
    }

    // If no abstract control can be derived, then use the default control input into constructor.
    if (!this.hasAbstractControl) {
      if (this._defaultControl instanceof TFormArray) {
        this._formArray = <any>this._defaultControl;
      } else if (this._defaultControl instanceof TFormControl) {
        this._formControl = <any>this._defaultControl;
      } else if (this._defaultControl instanceof TFormGroup) {
        this._formGroup = <any>this._defaultControl;
      }
    }

    if (this.hasAbstractControl) {
      // If the value input is updated, propegate the change to the set abstract control.
      if (changes.value && (!changes.value.firstChange || this.value != null)) {
        this.activeAbstractControl.setValue(this.value);
      }

      // If the contained abstract control has been initialized or updated, then sync value input with its value changes.
      if (this.activeAbstractControl !== this._prevAbstractCtrl) {
        this._prevAbstractCtrl = this.activeAbstractControl;
        this.value = this.activeAbstractControl.value;
        this._valueChangeSubscription.unsubscribe(); // Ensure we cleanup previous subscription if form control has changed.
        this._valueChangeSubscription = this.onValueChanges().subscribe(
          () => this.value = this.activeAbstractControl.value
        );
      }
    }
  }

  /**
   * On component destroy, calls next on the `_destroy$` subject so that all observables with `takeUntil(this._destroy$)` are completed.
   */
  ngOnDestroy() {
    this._destroy$.next(); // Cleanup form related RxJS subscriptions.
  }

  /**
   * Writes a given value to the underlying active abstract control; either formGroup or formControl.
   * @param value The value to write.
   * @param options Options for the write operation (See AbstractControl.setValue for more details).
   */
  writeValue(value: V, options?: UpdateValueOptions): void {
    // Only set the underlying control's value if it was not supplied via an input binding.
    // This implies that there is no encompassing from group which has supplied the derived component with its form control.
    if (!this.controlInputBound) {
      this.activeAbstractControl.setValue(value, options);
    }
  }

  /**
   * Registers a given on change callback function, which should be invoked whenever a change is detected in the
   * underlying active abstract control; either formGroup or formControl.
   * @param onChangeCb The on change callback function.
   */
  registerOnChange(onChangeCb: (value: V) => void): void {
    this._onChangeCb = onChangeCb;
  }

  /**
   * Registers a given on touched callback function, which should be invoked whenever a blur event is detected
   * in the underlying view element.
   * @param onTouchedCb The on touched callback function.
   */
  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  /**
   * Sets the disabled state of the underlying active abstract control; either formGroup or formControl.
   * @param isDisabled Whether or not disable should be set.
   */
  setDisabledState(isDisabled: boolean): void {
    if (!this.controlInputBound) {
      (isDisabled) ? this.activeAbstractControl.disable() : this.activeAbstractControl.enable();
    }
  }

  /**
   * Listens for value changes to occur within a given abstract control.
   * @param ctrl The abstract control that will be monitored for value changes.
   * If not set, then defaults to this form base component's active abstract control.
   * @return An observable that emits any value changes. Will automatically be unsubscribed from when component is destroyed.
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
