import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, ValidatorFn, ɵFormArrayRawValue, ɵFormArrayValue, ɵTypedOrUntyped } from '@angular/forms';
import { UpdateValueOptions } from '~web/forms/classes/t-abstract-control';

/**
 * A typed auto-resizing version of the built-in `FormArray`.
 * Auto-resizes itself and auto-generates its `TAbstractControl` elements whenever raw values are inserted.
 * @extends FormArray
 * @param T The type of each each raw element within the array or `TAbstractControl` in the array.
 * @param V The type of each raw element within the array.
 * @param A The type of each `AbstractControl` in the array. Defaults to `TAbstractControl<any>`.
 */
export class FlexFormArray<A extends AbstractControl> extends FormArray<A> {

  /**
   * Creates a new `FlexFormArray` instance.
   * @param init The initial raw value or abstract control elements of this form array. Defaults to an empty array.
   * @param memberInit A callback that is used to generate a new abstract control member
   * whenever raw values are added to the this form array. Defaults to generating a basic FormControl.
   * @param validatorOrOpts A synchronous validator function, or an array of such functions,
   * or an `AbstractControlOptions` object that contains validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  constructor(
    public init: (ɵFormArrayValue<A> | A) = [],
    public memberInit?: () => A,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super([], validatorOrOpts, asyncValidator);
    if (init instanceof Array) {
      for (const member of init) {
        this.push(<any>member);
      }
    }
  }

  /**
   * Patches the value of this `FormArray`. It accepts an array whose elements match the type of this form array.
   * Will expand this form array in order to accommodate the patch value.
   * Will not truncate this form array if the patch value is smaller than the size of this form array.
   *
   * @usageNotes
   * ### Patch the values for controls in this form array
   *
   * ```
   * const arr = new FormArray<FormControl<string>>(['', '']);
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
  patchValue(value: ɵFormArrayValue<A>, options?: UpdateValueOptions): void {
    this._restructureFormArray(value.length);
    super.patchValue(value, options);
  }

  /**
   * Pushes a new empty `AbstractFormControl` to the end of this `FormArray`.
   */
  push(): void;
  /**
   * Pushes a new raw value to the end of this `FormArray`.
   * @param control The raw value to push.
   */
  push(value: ɵFormArrayValue<A>): void;
  /**
   * Pushes a new `AbstractFormControl` to the end of this `FormArray`.
   * @param control The abstract form control control to push.
   */
  push(control: A): void;
  push(value: ɵFormArrayValue<A> | A = this._genEmptyMember()): void {
    if (value instanceof AbstractControl) {
      super.push(value);
      this.at(this.length - 1).valueChanges.subscribe(this._onElementValueChanges.bind(this, this.at(this.length - 1)));
    } else {
      this._addNeededElements(this.length + 1);
      this.at(this.length - 1).patchValue(value);
    }
    this.markAsDirty();
  }

  /**
   * Removes an element within this `FlexFormArray` at a given index, and marks the array as dirty.
   * @param index The index of the element to remove.
   */
  removeAt(index: number): void {
    super.removeAt(index);
    super.markAsDirty();
  }

  /**
   * Resets this `FormArray` to a specified value/state.
   * Marks all contained `TAbstractControl` elements as `pristine` and `untouched`.
   *
   * @usageNotes
   * ### Reset the values in a form array
   *
   * ```
   * const arr = new FormArray<FormControl<string>>(['first name', 'last name']);
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
  reset(resetState: ɵTypedOrUntyped<A, ɵFormArrayValue<A>, any> = [], options?: UpdateValueOptions): void {
    if (resetState instanceof Array) {
      this._restructureFormArray(resetState.length);
    }
    super.reset(resetState, options);
  }

  /**
   * Sets the value of this `FormArray`. It accepts an array whose elements match the type of this form array.
   * Will expand this form array in order to accommodate the set value.
   * Will truncate this form array if the set value is smaller than the size of this form array.
   *
   * @usageNotes
   * ### Sets the values for controls in this form array
   *
   * ```
   * const arr = new FormArray<FormControl<string>>(['', '']);
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
  setValue(value: ɵFormArrayRawValue<A>, options?: UpdateValueOptions): void {
    this._restructureFormArray(value.length);
    super.setValue(value, options);
  }

  protected _addNeededElements(length: number): void {
    while (this.length < length) {
      const memberCopy: A = this._genEmptyMember();
      this.controls.push(memberCopy);
      this.at(this.length - 1).valueChanges.subscribe(
        this._onElementValueChanges.bind(this, this.at(this.length - 1))
      );
    }
  }

  protected _genEmptyMember(): A {
    return (this.memberInit)
      ? this.memberInit()
      : <any>new FormControl<ɵFormArrayValue<A>>(null);
  }

  protected _onElementValueChanges(source: AbstractControl): void {
    this.updateValueAndValidity();
    if (source.dirty) {
      this.markAsDirty();
    }
  }

  protected _restructureFormArray(length: number): void {
    while (this.length > length) {
      this.controls.pop();
    }
    this._addNeededElements(length);
  }
}
