import { EventEmitter, Injectable, OnDestroy, Optional, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgControl, NgModel } from '@angular/forms';
import { BehaviorSubject, merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TAbstractControl, UpdateValueOptions } from '~web/forms/classes/t-abstract-control';
import { TFormControl } from '~web/forms/classes/t-form-control';
import { FormFieldConfig } from '~web/forms/interfaces/form-field-config';
import { DeriveAbstractControl, DeriveAbstractControlType } from '~web/forms/interfaces/template-type-util';
import { FormMonitorService } from '~web/forms/services/form-monitor/form-monitor.service';
import { FormValuePreprocessorService } from '~web/forms/services/form-value-preprocessor/form-value-preprocessor.service';
import { FormValidationService } from '../form-validation/form-validation.service';

/**
 * See {@link FormFieldService} below for the public version and full description.
 * This private version conceals most of the complex template type derivation.
 *
 * @param T Either the raw type of the form control data, or the type of the form control itself.
 * @param E The optional type of the form data exposed to eternal bindings (before input conversion, and after output conversion).
 * @param V The type of the value contained within the component provider's form control. Derived from T.
 * @param C The type of the component provider's form control. Derived from T.
 */
@Injectable()
abstract class _FormFieldService<
  T, // Can be a raw value or some AbstractControl type.
  E, // Will usually be same type as V.
  V                             = DeriveAbstractControlType<T>,
  C extends TAbstractControl<V> = DeriveAbstractControl<T, V>
> implements ControlValueAccessor, OnDestroy {

  /**
   * An RxJs observable destroy trigger that emits a value during the {@link ngOnDestroy} lifecycle hook invocation.
   */
  readonly destroy$ = new Subject<void>();

  /**
   * An {@link EventEmitter} that may be used by the provider component as a valueChanges `@Output` binding.
   * Automatically outputs all `control.valueChanges` event emissions.
   */
  readonly valueChangesEmitter = new EventEmitter<E>();

  /**
   * The configuration for this service, mainly detailing how the {@link ControlValueAccessor} functions.
   */
  private _config: FormFieldConfig<V, C, E> = {};

  /**
   * The registered abstract control that will have external values and disabled state changes written to it.
   */
  private _control: C = new TFormControl<V>() as any; // Default control to handle value input before ngOnInit registration/injection.

  /**
   * Emits all value changes within the registered {@link control} that do not have the `{ emitEvent: false }` option.
   */
  private _valueChanges$ = new Subject<V>();

  /**
   * Emits all value changes within the registered {@link control} regardless of the `{ emitValue: boolean }` option.
   */
  private _value$ = new BehaviorSubject<V>(null);

  /**
   * Wether or not a {@link control} has been registered by the component provider.
   */
  private _registered = false;

  /**
   * Emits each time a {@link control} registration occurs.
   */
  private _register$ = new Subject<void>();

  /**
   * The registered `onChange` callback function that shall be used to emit value changes to externally bound non-injected controls.
   */
  private _onChangeCb: (value: E) => void = () => {};

  /**
   * The registered `onTouched` callback function that shall be used to emit blur changes to externally bound non-injected controls.
   */
  private _onTouchedCb: () => void = () => {};

  /**
   * Constructs a new {@link FormFieldService}.
   * @param formMonitor A service that provides augmented monitoring functionality for reactive form controls.
   * @param formValuePreprocessor A service that pre-processes a raw value that is to be set to a reactive form control
   * in order to prevent various possible errors.
   * @param _controlContainer Holds a reference to any {@link FormGroup} or {@link FormArray} instance that is found
   * in the parent components template, and is bound to an element that surrounds this component's host element.
   * @param _ngControl A form directive base that also acts as an input binding through which an external {@link AbstractControl}
   * is bound to this element. e.g) `formArrayName`, `formControl`, `formControlName`, `formGroup`, `formGroupName`, or `ngModel`.
   */
  constructor(
    public formMonitor: FormMonitorService,
    public formValidation: FormValidationService,
    public formValuePreprocessor: FormValuePreprocessorService<V>,
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
  get control(): C {
    return this._control;
  }

  /**
   * Whether or not the control was injected via bound reactive form directive.
   */
  get controlInjected(): boolean {
    return (this.control === this.externalControl as TAbstractControl<any>);
  }

  /**
   * Whether or not a control has been injected/registered from within the provider component.
   */
  get controlRegistered(): boolean {
    return this._registered;
  }

  /**
   * The form control that is externally bound to the provider component, and may be injected (registered).
   */
  get externalControl(): TAbstractControl<E> {
    return !(this._ngControl instanceof NgModel) // NgModel will have FormControl as control, but do not want to inject.
      ? (this._ngControl?.control || this._controlContainer?.control) as TAbstractControl<E>
      : null;
  }

  /**
   * The current (raw) value of the contained {@link control}.
   */
  get value(): V {
    return this._control.value;
  }

  /**
   * An observable that emits an event every time the value of the registered {@link control} changes, in the UI or programmatically.
   *
   * It also emits an event each time you call enable() or disable() without passing along `{ emitEvent: false }` as a function argument.
   *
   * `Note`: The RxJS subscription is automatically destroyed upon the `ngOnDestroy` lifecycle hook.
   */
  get valueChanges$(): Observable<V> {
    return this._valueChanges$.asObservable().pipe(this.untilDestroy());
  }

  /**
   * An observable that emits an event every time the value of the registered {@link control} changes, in the UI or programmatically.
   *
   * Will emit an event even if `{ emitEvent: false }` is passed as a function argument.
   *
   * `Note`: The RxJS subscription is automatically destroyed upon the `ngOnDestroy` lifecycle hook.
   */
  get value$(): Observable<V> {
    return this._value$.asObservable().pipe(this.untilDestroy());
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
   *
   * @param value The new value that should be shared externally. Defaults to current `value` of the registered {@link control}.
   */
  emitValueChange(): void {
    const valueOut: E = this.valueOut();
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
   *   this.formFieldService.injectControl({ component: this });
   *   // From here forward, this.formFieldService.control should be set...
   * }
   * ```
   *
   * @param @param config The {@link FormFieldConfig} which primarily configures how the {@link ControlValueAccessor}
   * interface interacts with the registered {@link control}. Also, enables the definition of a fallback control generator
   * shall be invoked to generate a default control if one cannot be injected.
   * @return The injected `AbstractControl`, or the generated fallback control if one could not be injected.
   */
  injectControl(config: FormFieldConfig<V, C, E> = {}): C {
    // Attempt to grab control from NgControl (FormControl) or ControlContainer (FormGroup | FormArray).
    const control: C = this.externalControl as any;
    config.genDefault = config.genDefault ?? (() => this.control as any);
    this.registerControl(control || config.genDefault(), config);
    return control as C;
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
   *   this.formFieldService.registerControl(new FormControl(), { component: this });
   *   // From here forward, this.formFieldService.control should be set...
   * }
   * ```
   *
   * @param control The {@link TAbstractControl} that shall be registered.
   * @param config The {@link FormFieldConfig} which primarily configures how the {@link ControlValueAccessor}
   * interface interacts with the registered {@link control}.
   */
  registerControl(control: C, config: FormFieldConfig<V, C, E> = {}): void {
    // Record disabled state & value set before registration, so they may be transferred to registered control.
    const disabled: boolean = this.control?.disabled;
    const value: V = this.control?.value;

    // Record registered control and config.
    this._control = control;
    this._config = config;
    this.formValuePreprocessor.autoPreprocess(this.control);

    // Set any disabled state & value that may have been bound via disabled/value input binding before the control's registration.
    if (disabled !== this.control.disabled) {
      (disabled ? this.control.disable({ emitEvent: false }) : this.control.enable({ emitEvent: false }));
    }
    if (value != null && value !== this.value) {
      this.valueIn(value as any);
    }

    this._register$.next(); // Mark as registered. Will also cleanup all previous subscriptions for default/old control.
    this._registered = true;

    // Ensure that validators in non-injected externally bound control also apply internally, and vice-versa.
    if (!this.controlInjected && this.externalControl) {
      this.formValidation.syncValidation(this.externalControl, this.control);
    }

    // Initialize various observers for emitting/invoking ControlValueAccessor callback outputs, and observing value changes.
    this._initChangeEmitters();
    this._initValueChangeObservers();
  }

  /**
   * Initializes the default value change emitter, which invokes the {@link _onChangeCb} callback registered
   * via the {@link registerOnChange} method. Notifies an externally bound control that a value change occurred.
   *
   * Initializes the default touched (blur) emitter, which invokes the {@link _onTouchedCb} callback registered
   * via the {@link registerOnTouched} method. Notifies an externally bound control that a blur occurred.
   */
  private _initChangeEmitters(): void {
    // Init default onChange callback emitter.
    if (!this._config.omitDefaultChangeEmitter) {
      this.valueChanges$.subscribe(
        () => this.emitValueChange()
      );
    }

    // Init default onTouched callback emitter.
    if (!this._config.omitDefaultTouchedEmitter) {
      this.formMonitor.onMarkAsTouched(this.control).pipe(this.untilDestroy(this._register$)).subscribe(
        () => this.emitTouched()
      );
    }
  }

  /**
   * Initializes value change observers for a newly registered {@link control}.
   */
  private _initValueChangeObservers(): void {
    // Observer ignores value changes with { emitValue: false } option.
    this.control.valueChanges.pipe(this.untilDestroy(this._register$)).subscribe(
      (value: V) => this._valueChanges$.next(value)
    );

    // Observer oversees all changes regardless of { emitValue: false } option.
    this.formMonitor.onMutateValue(this.control).pipe(this.untilDestroy(this._register$)).subscribe(
      (value: V) => this._value$.next(value)
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
  valueIn(valueIn: E, options: UpdateValueOptions = { emitEvent: false }): V {
    const value: V = (this._config?.valueInConverter)
      ? this._config.valueInConverter(valueIn)
      : valueIn as any;
    this.control.patchValue(value, options);
    return this.value;
  }

  /**
   * @returns The current value of the registered {@link control} after processed by any configured
   * {@link FormFieldConfig.valueOutConverter}.
   */
  valueOut(): E {
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
  valuePropIn<K extends keyof E>(valueProp: K, valuePropIn: E[K], options: UpdateValueOptions = { emitEvent: false }): void {
    const valueIn: E = (this.valueOut() ?? {}) as any;
    valueIn[valueProp] = valuePropIn;
    this.valueIn(valueIn, options);
  }

  /*************************************************************************/
  /**************** RxJS Cleanup/Unsubscribe Functionality *****************/
  /*************************************************************************/

  /**
   * Cleanup all RxJS subscriptions associated with this service and provider component ({@link untilDestroy}).
   * Automatically invoked when the component provider is destroyed (removed from DOM).
   */
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Generates a pipeable RxJs operator that is shorthand for `takeUntil(this._destroy$)`.
   *
   * `this.destroy$.next()` shall be invoked during {@link ngOnDestroy}, which will cause any piped observable to unsubscribe.
   *
   * @usageNotes
   * ### Auto-unsubscribe
   *
   * The following example results in an observable that auto-unsubscribes during `ngOnDestroy`.
   *
   * ```ts
   *   myObservable$.pipe(this._untilDestroy()).subscribe((value: any) => {
   *     ...
   *   });
   * ```
   *
   * @param extraDestroy$ Optional extra observable(s) that will trigger the completion of the source observable.
   * @returns The pipe operator function.
   */
  untilDestroy<A>(...extraDestroy$: Observable<any>[]): OperatorFunction<A, A> {
    const destroy$: Observable<any> = (extraDestroy$.length)
      ? merge(this.destroy$, ...extraDestroy$)
      : this.destroy$;
    return (source: Observable<A>) => source.pipe(takeUntil(destroy$));
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
  registerOnChange(fn: (value: E) => void): void {
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
    if (!this.controlInjected) { // No need to sync disabled change from external control if external control is registered control.
      (disabled ? this._control.disable() : this._control.enable());
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
  writeValue(value: E): void {
    if (!this.controlInjected) { // No need to write value change from external control if external control is registered control.
      this.valueIn(value);
    }
  }
}

/**
 * A stateful service that automatically sets up default {@link ControlValueAccessor} functionality for a component provider,
 * which greatly reduces the necessary boilerplate.
 *
 * Contains functionality for directly injecting a form control bound to the component provider via {@link NgControl} directive.
 *
 * Aggregates helpful form utility services for use within the component (e.g. {@link FormMonitorService}).
 *
 * -------------
 *
 * See {@link injectControl} and {@link registerControl} for initially setting up & configuring this service.
 *
 * -------------
 *
 * @param T Either the raw type of the form control data, or the type of the form control itself.
 * @param E The optional type of the form data exposed to eternal bindings (before input conversion, and after output conversion).
 * Defaults to raw data type of `T`.
 */
@Injectable()
export class FormFieldService<T, E = T> extends _FormFieldService<T, DeriveAbstractControlType<E>> {}
