import { AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormState, TAbstractControl, UpdateValueOptions } from '~web/forms/classes/t-abstract-control';
import { DeriveAbstractControlType } from '~web/forms/interfaces/template-type-util';
import { TFormControl } from './t-form-control';

/**
 * A typed version of the built-in `FormArray`.
 * @param T The type of each each raw element within the array or `TAbstractControl` in the array.
 * @param V The type of each raw element within the array.
 * @param A The type of each `AbstractControl` in the array. Defaults to `TAbstractControl<any>`.
 */
export class TFormArray<
  T,
  V = DeriveAbstractControlType<T>,
  A extends TAbstractControl<V> = T extends TAbstractControl<V> ? T : TFormControl<V>
> extends FormArray implements TAbstractControl<V[]> {

  /**
   * An array whose elements are the `TAbstractControls` within this `TFormArray`.
   */
  readonly controls: A[];

  /**
   * The current value contained within this `TFormArray`.
   * Excludes values of elements that are disabled.
   * Use `getRawValue()` to include the values of disabled elements.
   */
  readonly value: V[];

  /**
   * An observable that emits the value of this `TFormArray` each time it changes in the UI or programmatically.
   * Also emits an event each time you call `enable()` or `disable()` without passing in the `emitEvent: false` option.
   */
  readonly valueChanges: Observable<V[]>;

  /**
   * Creates a new `TFormArray` instance.
   * @param controls An array of child controls. Each child control is given an index where it is registered.
   * @param validatorOrOpts A synchronous validator function, or an array of such functions,
   * or an `AbstractControlOptions` object that contains validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  constructor(
    controls: A[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  /**
   * Get the abstract control at the given index in this `TFormArray`.
   * @param index The index in the array to retrieve the control.
   * @return The `TAbstractControl` at the given index.
   */
  at(index: number): A {
    return super.at(index) as A;
  }

  /**
   * Gets the raw value of this `TFormArray`, including the values of any disabled elements.
   * Use the `value` property to get the value without any disabled elements.
   * @return The raw value, including disabled elements.
   */
  getRawValue(): V[] {
    return super.getRawValue();
  }

  /**
   * Patches the value of the FormArray. It accepts an array that matches the structure of the control,
   * and does its best to match the values to the correct controls in the group.
   *
   * It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   * @usageNotes
   * ### Patch the values for controls in this form array
   *
   * ```
   * const arr = new TFormArray<string>(['', '']);
   * console.log(arr.value);   // ['', '']
   *
   * arr.patchValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy', '']
   *
   * arr.patchValue(['Nancy', 'John', 'Paul']);
   * console.log(arr.value);   // ['Nancy', 'John', 'Paul']
   * ```
   *
   * @param value The patch array containing raw elements that are to be overlayed on the underlying array model.
   * @param options Configure options that determine how the control propagates changes and emits events after the value changes.
   * - onlySelf: When true, each change only affects this control, and not its parent. Default is false.
   * - emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value: Partial<V>[], options?: UpdateValueOptions): void {
    super.patchValue(value, options);
  }

  /**
   * Pushes a new `AbstractFormControl` to the end of this `TFormArray`.
   * @param control The abstract form control control to push.
   */
  push(control: A) {
    super.push(control);
  }

  /**
   * Removes an element within this `TFormArray` at a given index.
   * @param index The index of the element to remove.
   */
  removeAt(index: number): void {
    super.removeAt(index);
  }

  /**
   * Resets the FormArray and all descendants are marked pristine and untouched, and the value of all descendants to null or null maps.

   * You reset to a specific form state by passing in an array of states that matches the structure of the control.
   * The state is a standalone value or a form state object with both a value and a disabled status.
   *
   * @usageNotes
   * ### Reset the values in a form array
   *
   * ```
   * const arr = new TFormArray<string>(['first name', 'last name']);
   * arr.reset();
   *
   * console.log(this.arr.value);  // []
   * ```
   *
   * ### Reset the values in a form array and the disabled status for the first control
   *
   * ```
   * this.arr.reset([
   *   { value: 'first name', disabled: true },
   *   'last name'
   * ]);
   *
   * console.log(this.arr.value);          // ['name', 'last name']
   * console.log(this.arr.get(0).status);  // 'DISABLED'
   * ```
   *
   * @param value The value to reset this form array to. Defaults to an empty array.
   * @param options Configure options that determine how the control propagates changes and emits events after the value changes.
   * - onlySelf: When true, each change only affects this control, and not its parent. Default is false.
   * - emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  reset(resetState: FormState<V>[] = [], options?: UpdateValueOptions): void {
    super.reset(resetState, options);
  }

  /**
   * Sets the value of the FormArray. It accepts an array that matches the structure of the control.
   *
   * This method performs strict checks, and throws an error if you try to set the value of a control that doesn't exist
   * or if you exclude the value of a control.
   *
   * @usageNotes
   * ### Sets the values for controls in this form array
   *
   * ```
   * const arr = new TFormArray<string>(['', '']);
   * console.log(arr.value);   // ['', '']
   *
   * arr.setValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy']
   *
   * arr.setValue(['Nancy', 'John', 'Paul']);
   * console.log(arr.value);   // ['Nancy', 'John', 'Paul']
   * ```
   *
   * @param value The array containing raw elements that the underlying array model shall be set to.
   * @param options Configure options that determine how the control propagates changes and emits events after the value changes.
   * - onlySelf: When true, each change only affects this control, and not its parent. Default is false.
   * - emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  setValue(value: V[], options?: UpdateValueOptions): void {
    super.setValue(value, options);
  }
}
