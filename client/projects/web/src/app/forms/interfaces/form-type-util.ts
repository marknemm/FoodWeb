import { AbstractControl, FormControl, FormArray, FormGroup, AbstractControlOptions, FormBuilder, ɵElement } from '@angular/forms';
import { GeographyLocation } from '~shared';

const _formBuilder = new FormBuilder();

export function toControls<T extends {}>(controls: T, options?: AbstractControlOptions): FormBuilderResult<T> {
  return _formBuilder.group(controls, options).controls as FormBuilderResult<T>;
}

export type FormBuilderResult<T> = { [K in keyof T]: ɵElement<T[K], null> };

/**
 * Reactive Form utility type for deriving a specific reactive form control type based off of a given raw data type.
 * @param T The raw data type from which to derive a specific reactive form control type.
 * @param F Union of non-primitive types that shall be wrapped in a simple `FormControl`
 * instead of a `FormArray`, `FormGroup`, or `FormRecord`.
 */
export type Control<T, F extends Flatten = undefined> =
  [T] extends [AbstractControl]
    ? T
    : [T] extends [boolean | Date | GeographyLocation | number | string]
      ? FormControl<T>
      : [T] extends [F]
        ? FormControl<T>
        : [T] extends [Array<infer A>]
          ? FormArray<Control<A, F>>
          : [T] extends [{}]
            ? FormGroup<Controls<T, F>>
            : AbstractControl<T>

/**
 * Reactive Form utility wrapper type that designates a union of types that shall be wrapped in a simple `FormControl`
 * instead of a `FormArray`, `FormGroup`, or `FormRecord`.
 * @param T The union of types that shall be wrapped in a simple `FormControl` instead of a `FormArray`, `FormGroup`, or `FormRecord`.
 */
export type Flatten<T extends {} = any>
  = T;

/**
 * Reactive Form utility type for deriving the type of form control members of a `FormGroup` based off of a given raw data type.
 * @param T The raw data type from which to derive the form control members of a `FormGroup`.
 * @param F Union of non-primitive types that shall be wrapped in a simple `FormControl`
 * instead of a `FormArray`, `FormGroup`, or `FormRecord`.
 */
export type Controls<T extends {} = any, F extends Flatten = undefined> =
  { [K in keyof T]-?: Control<T[K], F> };

/**
 * Reactive Form utility type for extracting the raw data type form a given reactive form control type.
 * @param T The reactive form control type from which to extract the raw data type.
 */
export type Data<T extends AbstractControl | Controls> =
  T extends FormControl<infer C>
    ? C
    : T extends FormArray<infer A>
      ? Data<A>[]
      : T extends FormGroup<infer G>
        ? Data<G> // G is of type Controls.
        : T extends Controls
          ? { [K in keyof T]: Data<T[K]> }
          : T extends AbstractControl<infer U>
            ? U
            : any;

/**
 * A type extension that is used to derive the type of a `AbstractControl` based off of a
 * seed type T, which can be either an `AbstractControl` type or a raw value type.
 * @param T The seed type, which may be either an abstract control type or raw value type.
 */
export type DeriveAbstractControlType<T> =
  T extends AbstractControl<infer U>
    ? U
    : T;

/**
 * A type extension that is used to derive the AbstractControl type based off of a seed type T,
 * which can be either an `AbstractControl` type or a raw value type.
 * @param T The seed type, which may be either an abstract control type or raw value type.
 * @param V The raw value type of the abstract control.
 */
export type DeriveAbstractControl<T, V> =
  T extends AbstractControl<V>
    ? T
    : FormControl<V>;

export interface UpdateValueOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
}
