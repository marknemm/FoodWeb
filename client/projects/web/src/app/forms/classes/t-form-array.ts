import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, ValidatorFn } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormState, TAbstractControl, UpdateValueOptions } from '~web/forms/classes/t-abstract-control';
import { DeriveAbstractControlType } from '~web/forms/interfaces/template-type-util';
import { TFormControl } from './t-form-control';
import { TFormGroup } from './t-form-group';

/**
 * A typed version of the built-in `FormArray`.
 * Auto-resizes itself and auto-generates its `TAbstractControl` elements whenever raw values are inserted.
 * @extends FormArray
 * @param T The type of each each raw element within the array or `TAbstractControl` in the array.
 * @param V The type of each raw element within the array.
 * @param A The type of each `AbstractControl` in the array. Defaults to `TAbstractControl<any>`.
 */
export class TFormArray<
  T,
  V = DeriveAbstractControlType<T>,
  A extends TAbstractControl<V> = T extends TAbstractControl<V> ? T : TFormControl<V>
> extends FormArray {

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
   * Note that this only monitors for shallow value changes within the array. Use `deepValueChanges()` to monitor deep value changes.
   */
  readonly valueChanges: Observable<V[]>;

  /**
   * A subject that will be used to trigger cleanup for contained observables on a call to `destory()`.
   */
  private readonly _destroySubject$ = new Subject();

  private _deepValueChanges = new Subject<Partial<V>[]>();

  /**
   * Creates a new `TFormArray` instance.
   * @param init The initial raw value or abstract control elements of this form array. Defaults to an empty array.
   * @param memberInit A callback that is used to generate a new abstract control member
   * whenever raw values are added to the this form array. Defaults to generating a basic FormControl.
   * @param validatorOrOpts A synchronous validator function, or an array of such functions,
   * or an `AbstractControlOptions` object that contains validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  constructor(
    public init: (Partial<V> | A)[] = [],
    public memberInit?: () => A,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super([], validatorOrOpts, asyncValidator);
    for (const member of init) {
      this.push(<any>member);
    }
    this.valueChanges.subscribe(() => this._deepValueChanges.next(this.value));
  }

  /**
   * An observable that emits the updated value of this `TFormArray` whenever a change is detected in any of its elements.
   */
  get deepValueChanges(): Observable<Partial<V>[]> {
    return this._deepValueChanges.asObservable();
  }

  /**
   * An observable that shall be used to trigger cleanup of other observables via the `takeUntil` pipe.
   */
  protected get _destroy$(): Observable<any> {
    return this._destroySubject$.asObservable();
  }

  /**
   * Get the abstract control at the given index in this `TFormArray`.
   * @param index The index in the array to retrieve the control.
   * @return The `TAbstractControl` at the given index.
   */
  at(index: number): A {
    return <A>super.at(index);
  }

  /**
   * Checks the validity of this `TFormArray`. In doing so, marks all members as `touched`.
   * @return true if this form array and all of its members have passed all of their validaiton tests, false otherwise.
   */
  checkValidity(): boolean {
    this.markAllAsTouched();
    return this.valid;
  }

  /**
   * Triggers the default cleanup of any observables that were generated by calls to `onValueChanges()`
   * which were supplied with the default argument for the `$destroy` observable.
   * @param onlySelf Defaults to `false`. Set to `true` if only this `TFormArray` should have its generated
   * observables destroyed, and not any of its children.
   */
  destroy(onlySelf = false): void {
    this._destroySubject$.next();

    if (!onlySelf) {
      // Trigger a call to destroy in all contained TAbstractControl elements.
      this.controls.forEach((control: AbstractControl) => {
        if (control instanceof TFormArray || control instanceof TFormControl || control instanceof TFormGroup) {
          control.destroy();
        }
      });
    }
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
   * Gets an observable that emits the updated value of this `TFormArray` whenever a change is detected in any of its elements.
   * Also, emits an event each time you call `enable()` or `disable()` on this control without `emitEvent: false`.
   * @param destroy$ An observable that, when fired, will cause the returned observable to complete.
   * If not supplied, then a default internal observable will be used. It will be triggered when the `destory()` method is invoked.
   * @return An observable that emits the value of this form control when its value changes.
   * This observable will automatically be completed when the `destroy$` input emits.
   */
  onDeepValueChanges(destroy$: Observable<any> = this._destroy$): Observable<Partial<V>[]> {
    return this.deepValueChanges.pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Gets an observable that emits the value of this `TFormArray` each time it changes in the UI or programmatically.
   * Also, emits an event each time you call `enable()` or `disable()` on this control without `emitEvent: false`.
   * Note that this only monitors for shallow value changes within the array. Use `onDeepValueChanges()` to monitor deep value changes.
   * @param destroy$ An observable that, when fired, will cause the returned observable to complete.
   * If not supplied, then a default internal observable will be used. It will be triggered when the `destory()` method is invoked.
   * @return An observable that emits the value of this form control when its value changes.
   * This observable will automatically be completed when the `destroy$` input emits.
   */
  onValueChanges(destroy$: Observable<any> = this._destroy$): Observable<V[]> {
    return this.valueChanges.pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Patches the value of this `TFormArray`. It accepts an array whose elements match the type of this form array.
   * Will expand this form array in order to accomodate the patch value.
   * Will not truncate this form array if the patch value is smaller than the size of this form array.
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
   * @param value The patch array contianing raw elements that are to be overlayed on the underlying array model.
   * @param options Configure options that determine how the control propagates changes and emits events after the value changes.
   * - onlySelf: When true, each change only affects this control, and not its parent. Default is false.
   * - emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value: Partial<V>[], options?: UpdateValueOptions): void {
    this._addNeededElements(value.length);
    super.patchValue(value, options);
  }

  /**
   * Pushes a new empty `AbstractFormControl` to the end of this `TFormArray`.
   */
  push(): void;
  /**
   * Pushes a new raw value to the end of this `TFormArray`.
   * @param control The raw value to push.
   */
  push(value: Partial<V>): void;
  /**
   * Pushes a new `AbstractFormControl` to the end of this `TFormArray`.
   * @param control The abstract form control control to push.
   */
  push(control: A): void;
  push(value: Partial<V> | A = this._genEmptyMember()): void {
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
   * Removes an element within this `TFormArray` at a given index.
   * @param index The index of the element to remove.
   * @return The removed `TAbstractControl` element.
   */
  removeAt(index: number): A {
    const control: A = this.at(index);
    super.removeAt(index);
    super.markAsDirty();
    return control;
  }

  /**
   * Resets this `TFormArray` to a specified value/state.
   * Marks all contained `TAbstractControl` elements as `pristine` and `untouched`.
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
    if (resetState instanceof Array) {
      this._restructureFormArray(resetState.length);
    }
    super.reset(resetState, options);
  }

  /**
   * Sets the value of this `TFormArray`. It accepts an array whose elements match the type of this form array.
   * Will expand this form array in order to accomodate the set value.
   * Will truncate this form array if the set value is smaller than the size of this form array.
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
   * @param value The array contianing raw elements that the underlying array model shall be set to.
   * @param options Configure options that determine how the control propagates changes and emits events after the value changes.
   * - onlySelf: When true, each change only affects this control, and not its parent. Default is false.
   * - emitEvent: When true or not supplied (the default), both the statusChanges and valueChanges observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  setValue(value: Partial<V>[], options?: UpdateValueOptions): void {
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
      : <any>new TFormControl<V>();
  }

  protected _onElementValueChanges(source: AbstractControl): void {
    this.updateValueAndValidity();
    if (source.dirty) {
      this.markAsDirty();
    }
    this._deepValueChanges.next(this.value);
  }

  protected _restructureFormArray(length: number): void {
    while (this.length > length) {
      this.controls.pop();
    }
    this._addNeededElements(length);
  }
}

// Enhance type declaration for FormArray.
declare module '@angular/forms' {
  interface FormArray {
    checkValidity(): boolean;
    destory(): void;
    onDeepValueChanges(destroy$?: Observable<any>): Observable<any[]>;
    onValueChanges(destroy$?: Observable<any>): Observable<any[]>;
  }
}

// Add extra methods to basic FormArray so that it is fully compaitble with TFormArray.
FormArray.prototype.checkValidity = TFormArray.prototype.checkValidity;
FormArray.prototype.destory = TFormArray.prototype.destroy;
FormArray.prototype.onDeepValueChanges = TFormArray.prototype.onDeepValueChanges;
FormArray.prototype.onValueChanges = TFormArray.prototype.onValueChanges;

Object.defineProperty(FormArray.prototype, '_destroySubject$', {
  get: function(): Subject<any> {
    if (!this.__destroySubject$) {
      this.__destroySubject$ = new Subject();
    }
    return this.__destroySubject$;
  },
  set: function(destroySubject$: Subject<any>) {
    this.__destroySubject$ = destroySubject$;
  }
});

Object.defineProperty(FormArray.prototype, '_destroy$', { get: function() {
  return this._destroySubject$.asObservable();
}});
