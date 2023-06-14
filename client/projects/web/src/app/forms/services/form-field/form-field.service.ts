import { EventEmitter, Injectable, Optional, Self } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, FormControl, NgControl, NgModel } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormFieldConfig } from '~web/forms/interfaces/form-field-config';
import { Control, UpdateValueOptions } from '~web/forms/interfaces/form-type-util';
import { FormMonitorService } from '~web/forms/services/form-monitor/form-monitor.service';
import { DestroyService } from '~web/shared/services/destroy/destroy.service';
import { FormValidationService } from '../form-validation/form-validation.service';

/**
 * A stateful service that either:
 *
 * - Injects an {@link AbstractControl} bound to the component provider via {@link NgControl} directive.
 * - Registers an internal {@link AbstractControl} that gets auto-synced with an externally bound one via
 * {@link ControlValueAccessor} (removes boilerplate).
 *
 * -------------
 *
 * See {@link injectControl} and {@link registerControl} for initially setting up & configuring this service.
 *
 * -------------
 *
 * @param VIEW_MODEL_T The type of the raw data that is maintained by the registered/injected {@link AbstractControl}
 * with type {@link CONTROL_T}.
 * @param CONTROL_T The optional type of the registered/injected {@link AbstractControl} containing raw data type {@link VIEW_MODEL_T}.
 * Auto-derived from {@link VIEW_MODEL_T} if not explicitly set.
 * @param EXTERNAL_VIEW_MODEL_T The optional type of the externally bound control's raw data.
 * Should not be different than {@link VIEW_MODEL_T} if control is expected to be injected.
 * Defaults to {@link VIEW_MODEL_T} if not explicitly set.
 */
@Injectable()
export class FormFieldService<
  VIEW_MODEL_T,
  CONTROL_T extends AbstractControl = Control<VIEW_MODEL_T>,
  EXTERNAL_VIEW_MODEL_T = VIEW_MODEL_T
> implements ControlValueAccessor {

  /**
   * An {@link EventEmitter} that may be used by the provider component as a valueChanges `@Output` binding.
   * Automatically outputs all `control.valueChanges` event emissions.
   */
  readonly valueChangesEmitter = new EventEmitter<EXTERNAL_VIEW_MODEL_T>();

  private _config: FormFieldConfig<VIEW_MODEL_T, CONTROL_T, EXTERNAL_VIEW_MODEL_T> = {};

  /**
   * The registered abstract control that will have external values and disabled state changes written to it.
   */
  private _control: CONTROL_T = new FormControl<VIEW_MODEL_T>(null) as any; // Ensure not null before control injection/registration.

  /**
   * Emits all value changes within the registered {@link control} that do not have the `{ emitEvent: false }` option.
   */
  private _valueChanges$ = new Subject<VIEW_MODEL_T>();

  /**
   * Emits all value changes within the registered {@link control} regardless of the `{ emitValue: boolean }` option.
   */
  private _value$ = new BehaviorSubject<VIEW_MODEL_T>(null);

  /**
   * Emits each time a {@link control} registration occurs.
   */
  private _register$ = new Subject<void>();

  /**
   * The registered `onChange` callback function that shall be used to emit value changes to externally bound non-injected controls.
   */
  private _onChangeCb: (value: EXTERNAL_VIEW_MODEL_T) => void = () => {};

  /**
   * The registered `onTouched` callback function that shall be used to emit blur changes to externally bound non-injected controls.
   */
  private _onTouchedCb: () => void = () => {};

  /**
   * Constructs a new {@link FormFieldService}.
   * @param _formMonitorService A service that provides augmented monitoring functionality for reactive form controls.
   * @param _controlContainer Holds a reference to any {@link FormGroup} or {@link FormArray} instance that is found
   * in the parent components template, and is bound to an element that surrounds this component's host element.
   * @param _ngControl A form directive base that also acts as an input binding through which an external {@link AbstractControl}
   * is bound to this element. e.g) `formArrayName`, `formControl`, `formControlName`, `formGroup`, `formGroupName`, or `ngModel`.
   */
  constructor(
    private _formMonitorService: FormMonitorService,
    private _formValidationService: FormValidationService,
    private _destroyService: DestroyService,
    @Self() @Optional()
    private _controlContainer: ControlContainer,
    @Self() @Optional()
    private _ngControl: NgControl,
  ) {
    // Automatically register this component as an NG_VALUE_ACCESSOR provider (framework will use contained ControlValueAccessor methods).
    if (this._ngControl) {
      this._ngControl.valueAccessor = this;
    }
  }

  /**
   * The registered `AbstractControl`, which was either injected via {@link injectControl} or registered via {@link registerControl}.
   * If accessed prior to registration, then defaults to a simple `FormControl`.
   */
  get control(): CONTROL_T {
    return this._control;
  }

  /**
   * Whether or not the control was injected via bound reactive form directive.
   */
  get controlInjected(): boolean {
    return (this.control === this.externalControl);
  }

  /**
   * An RxJs {@link Observable} destroy trigger that emits a value during the {@link ngOnDestroy} lifecycle hook invocation.
   */
  get destroy$(): Subject<void> {
    return this._destroyService.destroy$;
  }

  /**
   * The form control that is externally bound to the provider component, and may be injected (registered).
   */
  get externalControl(): AbstractControl<EXTERNAL_VIEW_MODEL_T> {
    return !(this._ngControl instanceof NgModel) // Ensure not [(ngModel)] binding with raw data.
      ? (this._ngControl?.control ?? this._controlContainer?.control)
      : null;
  }

  /**
   * The current (raw) value of the contained {@link control}.
   */
  get value(): VIEW_MODEL_T {
    return this.control?.value;
  }

  /**
   * An observable that emits an event every time the value of the registered {@link control} changes, in the UI or programmatically.
   *
   * It also emits an event each time you call enable() or disable() without passing along `{ emitEvent: false }` as a function argument.
   *
   * `Note`: The RxJS subscription is automatically destroyed upon the `ngOnDestroy` lifecycle hook.
   */
  get valueChanges$(): Observable<VIEW_MODEL_T> {
    return this._valueChanges$.asObservable().pipe(this._destroyService.untilDestroy());
  }

  /**
   * An observable that emits an event every time the value of the registered {@link control} changes, in the UI or programmatically.
   *
   * Will emit an event even if `{ emitEvent: false }` is passed as a function argument.
   *
   * `Note`: The RxJS subscription is automatically destroyed upon the `ngOnDestroy` lifecycle hook.
   */
  get value$(): Observable<VIEW_MODEL_T> {
    return this._value$.asObservable().pipe(this._destroyService.untilDestroy());
  }

  /**
   * Invokes the touched callback function registered by the framework via {@link registerOnTouched}.
   * Notifies externally bound reactive form controls that a touched/blur event has occurred.
   *
   * Unless configured otherwise via {@link FormFieldConfig.omitDefaultTouchedEmitter}, will automatically be invoked upon blur.
   */
  emitTouched(): void {
    if (!this.controlInjected) { // No need to emit ControlValueAccessor onTouched callback if external control is the registered control.
      this._onTouchedCb();
    }
  }

  /**
   * Invokes the change callback function registered by the framework via {@link registerOnChange}.
   * Notifies externally bound reactive form controls that a value change has occurred.
   *
   * Unless configured otherwise via {@link FormFieldConfig.omitDefaultChangeEmitter}, will automatically be invoked upon change.
   */
  emitValueChange(): void {
    const valueOut: EXTERNAL_VIEW_MODEL_T = this.valueOut();
    this.valueChangesEmitter.emit(valueOut);
    if (!this.controlInjected) { // No need to emit ControlValueAccessor onChange callback if external control is the registered control.
      this._onChangeCb(valueOut);
    }
  }

  /**
   * Attempts to automatically inject and register a control bound to this component's element via directive:
   * `formArrayName`, `formControl`, `formControlName`, `formGroup`, `formGroupName`, or `ngModel`
   *
   * @usageNotes
   * ### Auto-Inject Bound AbstractControl During ngOnInit
   *
   * The following example shows the minimum setup for auto-injecting an externally bound FormControl.
   *
   * ```ts
   * ngOnInit(): void {
   *   // genDefault can optionally be supplied in-case no external control bound for injection.
   *   this.formFieldService.injectControl({ genDefault: () => new FormControl<string>() });
   * }
   * ```
   *
   * @param config The {@link FormFieldConfig} which specifies a default control if injection is not possible,
   * and configures how the {@link ControlValueAccessor} interface interacts with the injected {@link control}.
   *
   * @return The injected `AbstractControl`, or the configured fallback control if one could not be injected.
   */
  injectControl(config: FormFieldConfig<VIEW_MODEL_T, CONTROL_T, EXTERNAL_VIEW_MODEL_T> = {}): CONTROL_T {
    return this.registerControl(this.externalControl as CONTROL_T, config);
  }

  /**
   * Registers an abstract control that will have external values and disabled state changes written to it.
   *
   * @usageNotes
   * ### Auto-Inject Bound AbstractControl During ngOnInit
   *
   * The following example shows the minimum setup for auto-injecting an externally bound FormControl.
   *
   * ```ts
   * ngOnInit(): void {
   *   this.formFieldService.registerControl(new FormControl<string>());
   * }
   * ```
   *
   * @param control The {@link AbstractControl} that shall be registered.
   * @param config The {@link FormFieldConfig} which configures how the {@link ControlValueAccessor}
   * interface interacts with the registered {@link control}.
   *
   * @return The registered `AbstractControl`.
   */
  registerControl(control: CONTROL_T, config: FormFieldConfig<VIEW_MODEL_T, CONTROL_T, EXTERNAL_VIEW_MODEL_T> = {}): CONTROL_T {
    // Ensure valid config and contained genDefault method.
    this._config = (config ?? this._config ?? {});
    this._config.genDefault = (this._config.genDefault ?? (() => new FormControl<VIEW_MODEL_T>(null) as any));

    // Record newly registered control, and transfer old control state to it without emitting change events.
    const oldControl: CONTROL_T = this.control;
    this._control = (control ?? this._config.genDefault());
    this._transferOldControlState(oldControl, this.control);

    // Mark as registered. Will also cleanup all previous subscriptions for old control (important to call before new observer setup).
    this._register$.next();

    // Initialize various observers for emitting/invoking ControlValueAccessor callback outputs, and observing value changes.
    this._autoSyncExternalControlState();
    this._initValueChangeObservers();

    return this.control;
  }

  /*************************************************************************/
  /******************** Control Registration Helpers ***********************/
  /*************************************************************************/

  /**
   * Transfer the disabled state and value of a given `from` control to a given `to` control.
   *
   * @param oldControl The control from which to transfer the state.
   * @param newControl The control to transfer the state to.
   */
  private _transferOldControlState(oldControl: CONTROL_T, newControl: CONTROL_T): void {
    if (oldControl && newControl) {
      if (oldControl.disabled !== newControl.disabled) {
        (oldControl.disabled)
          ? newControl.disable({ emitEvent: false })
          : newControl.enable({ emitEvent: false }); // No emit, make transfer seamless.
      }

      if (oldControl.getRawValue() != null) {
        newControl.patchValue(oldControl.getRawValue(), { emitEvent: false }); // no emit, make transfer seamless.
      }
    }
  }

  /**
   * Auto-Synchronizes internally registered control state with an externally bound (non-injected) control.
   * Re-synchronizes the state whenever a change is detected on the internally registered control.
   *
   * Initializes the default value change emitter, which invokes the {@link _onChangeCb} callback registered
   * via the {@link registerOnChange} method. Notifies an externally bound control that a value change occurred.
   *
   * Initializes the default touched (blur) emitter, which invokes the {@link _onTouchedCb} callback registered
   * via the {@link registerOnTouched} method. Notifies an externally bound control that a blur occurred.
   */
  private _autoSyncExternalControlState(): void {
    // Ensure that validators in non-injected externally bound control also apply internally, and vice-versa.
    if (this._config?.syncValidation && !this.controlInjected) {
      this._formValidationService.syncValidation(this.externalControl, this.control);
    }

    // Init default onChange callback emitter.
    if (!this._config?.omitDefaultChangeEmitter) {
      this.valueChanges$.subscribe(
        () => this.emitValueChange()
      );
    }

    // Init default onTouched callback emitter.
    if (!this._config?.omitDefaultTouchedEmitter) {
      this._formMonitorService.onMarkAsTouched(this.control).pipe(
        this._destroyService.untilDestroy(this._register$)
      ).subscribe(
        () => this.emitTouched()
      );
    }
  }

  /**
   * Initializes value change observers for a newly registered {@link control}.
   */
  private _initValueChangeObservers(): void {
    // Observer ignores value changes with { emitValue: false } option.
    this.control.valueChanges.pipe(
      this._destroyService.untilDestroy(this._register$)
    ).subscribe(
      (value: VIEW_MODEL_T) => this._valueChanges$.next(value)
    );

    // Observer oversees all changes regardless of { emitValue: false } option.
    this._formMonitorService.onMutateValue(this.control).pipe(
      this._destroyService.untilDestroy(this._register$)
    ).subscribe(
      (value: VIEW_MODEL_T) => this._value$.next(value)
    );

    // Init value$ BehaviorSubject state to current value if not already synced.
    if (this._value$.value !== this.value) {
      this._value$.next(this.value);
    }
  }

  /**
   * Patches the value of the registered {@link control} with a given value after it is processed by
   * any configured {@link FormFieldConfig.valueInConverter}.
   * @param valueIn The value to be patched within the registered form control.
   * @param options The {@link UpdateValueOptions} that shall be used to patch the value. Defaults to `{ emitEvent: false }`.
   * @return The value that was patched to the form control.
   */
  valueIn(valueIn: EXTERNAL_VIEW_MODEL_T, options: UpdateValueOptions = { emitEvent: false }): VIEW_MODEL_T {
    const value: VIEW_MODEL_T = (this._config?.valueInConverter)
      ? this._config.valueInConverter(valueIn)
      : valueIn as any;
    this.control.patchValue(value, { emitEvent: false, onlySelf: options?.onlySelf });
    if (options?.emitEvent) {
      setTimeout(() => this.control.updateValueAndValidity()); // Trigger change emit only after change cycle completes.
    }
    return this.value;
  }

  /**
   * @returns The current value of the registered {@link control} after processed by any configured
   * {@link FormFieldConfig.valueOutConverter}.
   */
  valueOut(): EXTERNAL_VIEW_MODEL_T {
    return (this._config?.valueOutConverter)
      ? this._config.valueOutConverter(this.control.value)
      : this.control.value as any;
  }

  /**
   * Patches the value of a single property within the object value of the registered {@link control} after it is processed by
   * any configured {@link FormFieldConfig.valueInConverter}.
   * @param valueProp The property that is to be patched.
   * @param valuePropIn The value of the property that is to be patched.
   * @param options The {@link UpdateValueOptions} that shall be used to patch the value. Defaults to `{ emitEvent: false }`.
   */
  valuePropIn<K extends keyof EXTERNAL_VIEW_MODEL_T>(
    valueProp: K,
    valuePropIn: EXTERNAL_VIEW_MODEL_T[K],
    options: UpdateValueOptions = { emitEvent: false }
  ): void {
    const valueIn: EXTERNAL_VIEW_MODEL_T = (this.valueOut() ?? {}) as any;
    valueIn[valueProp] = valuePropIn;
    this.valueIn(valueIn, options);
  }

  /*************************************************************************/
  /**************** Standard ControlValueAccessor Methods ******************/
  /*************************************************************************/

  /**
   * Registers a callback function, {@link _onChange}, that is called when the control's value changes in the UI.
   *
   * This method is called internally by the forms API on initialization to update the form
   * model when values propagate from the view to the model.
   *
   * `WARNING`: Do `NOT` invoke this method directly!
   *
   * @param fn The callback function to register.
   */
  registerOnChange(fn: (value: EXTERNAL_VIEW_MODEL_T) => void): void {
    this._onChangeCb = fn;
  }

  /**
   * Registers a callback function, {@link _onTouched}, that is called by the forms API on initialization
   * to update the form model on blur.
   *
   * `WARNING`: Do `NOT` invoke this method directly!
   *
   * @param fn The callback function to register.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouchedCb = fn;
  }

  /**
   * Function that is called by the forms API when the control status changes to or from 'DISABLED'.
   * Depending on the status, it enables or disables the appropriate DOM element.
   *
   * `WARNING`: Do `NOT` invoke this method directly!
   *
   * @param disabled The disabled status to set on the element.
   */
  setDisabledState(disabled: boolean): void {
    // No need to sync disabled change from external control if external control is injected as registered control.
    if (!this.controlInjected) {
      (disabled)
        ? this.control?.disable()
        : this.control?.enable();
    }
  }

  /**
   * Writes a new value to the element.
   * Called internally by the forms API to write to the view when programmatic changes from model to view are requested.
   *
   * `WARNING`: Do `NOT` invoke this method directly!
   *
   * @param value The new value for the element.
   */
  writeValue(value: EXTERNAL_VIEW_MODEL_T): void {
    // No need to write value change from external control if external control is injected as registered control.
    if (!this.controlInjected) {
      this.valueIn(value);
    }
  }
}

export const FormFieldProviders = [FormFieldService, DestroyService];
