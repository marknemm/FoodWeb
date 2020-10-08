import { AbstractControlOptions, AsyncValidatorFn, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormState, TAbstractControl, UpdateValueOptions } from '~web/data-structure/t-abstract-control';

/**
 * A typed version of the built-in `FormGroup`.
 * @extends FormGroup
 * @param T The type of the contained data object.
 */
export class TFormGroup<T> extends FormGroup {

  /**
   * An object whose members are the `TAbstractControls` within this `TFormGroup`.
   */
  readonly controls: { [K in keyof T]?: TAbstractControl<T[K]> };

  /**
   * The current value of this `TFormGroup`. Excludes all disabled controls.
   * Each value property related to a disabled control shall be undefinend.
   * Use the `getRawValue()` method to get the current value with disabled members included.
   */
  readonly value: T;

  /**
   * An observable that emits the value of this `TFormGroup` its value (value of any of its members) changes.
   * Also, emits an event each time you call `enable()` or `disable()` on without passing in the `emitEvent: false` option.
   */
  readonly valueChanges: Observable<T>;

  /**
   * Creates a new `TFormGroup` instance.
   * @param init The initial value for the form group. Must be an object that has the same structure as the from group's type.
   * Each property within the object may refer to a raw value, an `AbstractFormControl`, or an array whose first member is
   * an `AbstractFormControl`, and next member is either a validator function or validator function array.
   * @param validatorOrOpts A synchronous validator function, an array of such functions,
   * or an `AbstractControlOptions` object that contains validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  constructor(
    init: TFormControlMembers<T> = {},
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(
      new FormBuilder().group(init ? init : {}).controls,
      validatorOrOpts,
      asyncValidator
    );
  }

  /**
   * Adds an abstract control to this `TFormGroup`.
   * This method also updates the value and validity of the control.
   * @param name The name of the abstract control that shall be added.
   * @param control The `TAbstractControl` that shall be added.
   */
  addControl<K extends Extract<keyof T, string>>(
    name: K,
    control: TAbstractControl<T[K]>
  ): void {
    super.addControl(name, control);
  }

  /**
   * Checks the validity of this `TFormGroup`. In doing so, marks all members as `touched`.
   * @return true if this form group and all of its members have passed all of their validaiton tests, false otherwise.
   */
  checkValidity(): boolean {
    this.markAllAsTouched();
    return this.valid;
  }

  /**
   * Gets a given control within this `TFormGroup` via a given property name.
   * @param name The property name of the form group member.
   * @return The retrieved `TAbstractControl` member.
   */
  get<K extends Extract<keyof T, string>>(
    name: K | K[]
  ): TAbstractControl<T[K]> {
    return super.get(name);
  }

  /**
   * Gets the raw value of this `TFormGroup`, including the values of any disabled controls.
   * Use the `value` property to get the value without any disabled members.
   * @return The raw value, including disabled members.
   */
  getRawValue(): T {
    return super.getRawValue();
  }

  /**
   * Gets an observable that emits the value of a targete `TFormGroup` member whenever its value changes in the UI or programmatically.
   * Also, emits an event each time you call `enable()` or `disable()` on the member without configuring `emitEvent: false`.
   * @param name The name of the `TAbstractControl` member that shall be observed for changes.
   * @param destroy$ An observable that will cause the returned observable to complete when fired.
   * @return An observable that emits the value of the targeted abstract control member whenever its value changes.
   * This observable will automatically be completed when the `destroy$` input emits.
   */
  onValueChanges<K extends Extract<keyof T, string>>(
    name: K,
    destroy$: Observable<any>
  ): Observable<T[K]> {
    return this.get(name).valueChanges.pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Patches the value of this `TFormGroup`. It accepts an object that matches the structure of the form group's type, and attempts
   * to overlay the given object onto the underlying object serving as this form group's data model.
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * @usageNotes
   * ### Patch the value for a form group
   *
   * ```
   * const form = new TFormGroup<FullName>({ first: '', last: '' });
   * console.log(form.value);   // { first: '', last: '' }
   *
   * form.patchValue({ first: 'Nancy' });
   * console.log(form.value);   // { first: 'Nancy', last: '' }
   * ```
   *
   * @param value The object that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   * - `onlySelf`: When true, each change only affects this control and not its parent. Default is true.
   * - `emitEvent`: When true or not supplied (the default), both the `statusChanges` and `valueChanges` observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value: Partial<T>, options?: UpdateValueOptions): void {
    if (value) {
      super.patchValue(value, options);
    }
  }

  /**
   * Removes an abstract control from this `TFormGroup`.
   * @param name The name of the abstract control that shall be removed.
   * @return The removed `TAbstractControl`.
   */
  removeControl<K extends Extract<keyof T, string>>(
    name: K
  ): TAbstractControl<T[K]> {
    const control: TAbstractControl<T[K]> = this.get(name);
    super.removeControl(name);
    return control;
  }

  /**
   * Resets the `TFormGroup` to a specified value/state.
   * Marks all contained `TAbstractControl` properties as `pristine` and `untouched`.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ```
   * const form = new TFormGroup<FieldNames>({ first: 'first name', last: 'last name' });
   * console.log(form.value);  // { first: 'first name', last: 'last name' }
   *
   * form.reset();
   * console.log(form.value);  // { first: undefined, last: undefined }
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * form.reset({
   *   first: { value: 'name', disabled: true },
   *   last: 'last'
   * });
   *
   * console.log(this.form.value);  // { first: 'name', last: 'last name' }
   * console.log(this.form.get('first').status);  // 'DISABLED'
   * ```
   *
   * @param value Resets the control with an initial value, or an object that defines the initial value and disabled state.
   * @param options Configuration options that determine how the control propagates changes and emits events when the group is reset.
   * - `onlySelf`: When true, each change only affects this control, and not its parent. Default is false.
   * - `emitEvent`: When true or not supplied (the default), both the `statusChanges` and `valueChanges` observables emit events with
   * the latest status and value when the control is reset. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  reset(
    value?: { [K in keyof T]?: FormState<T[K]> },
    options?: UpdateValueOptions
  ): void {
    super.reset(value, options);
  }

  /**
   * Sets a given abstract control within this `TFormGroup`.
   * @param name The name of the abstract control.
   * @param control The `TAbstractControl` that is to be set.
   */
  setControl<K extends Extract<keyof T, string>>(
    name: K,
    control: TAbstractControl<T[K]>
  ): void {
    super.setControl(name, control);
  }

  /**
   * Sets the value of this `TFormGroup`. It accepts an object that matches the structure of the form group's type.
   *
   * @usageNotes
   * ### Set the complete value for the form group
   *
   * ```
   * const form = new TFormGroup<FullName>({ first: '', last: '' });
   * console.log(form.value);   // { first: '', last: '' }
   *
   * form.setValue({ first: 'Nancy', last: 'Drew' });
   * console.log(form.value);   // { first: 'Nancy', last: 'Drew' }
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   *
   * - `onlySelf`: When true, each change only affects this control, and not its parent. Default is false.
   * - `emitEvent`: When true or not supplied (the default), both the `statusChanges` and `valueChanges` observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   */
  setValue(value: Partial<T>, options?: UpdateValueOptions): void {
    super.setValue(value, options);
  }
}

export type TFormControlMembers<T> = {
  [K in keyof T]?:
      T[K]
    | TAbstractControl<T[K]>
    | [T[K]]
    | [T[K], ValidatorFn]
    | [T[K], ValidatorFn[]]
};
