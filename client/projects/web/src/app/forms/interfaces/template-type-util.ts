import { AbstractControl, FormControl } from '@angular/forms';
import { TAbstractControl } from '~web/forms/classes/t-abstract-control';
import { TFormGroup } from '../classes/t-form-group';

/**
 * A type extension that is used to derive the type of a `TAbstractControl` based off of a
 * seed type T, which can be either an `AbstractControl` type or a raw value type.
 * @param T The seed type, which may be either an abstract control type or raw value type.
 */
export type DeriveAbstractControlType<T> = T extends TAbstractControl<infer U>
  ? U
  : T extends AbstractControl
      ? any
      : T;

/**
 * A type extension that is used to derive the TAbstractControl type based off of a seed type T,
 * which can be either an `AbstractControl` type or a raw value type.
 * @param T The seed type, which may be either an abstract control type or raw value type.
 * @param V The raw value type of the abstract control.
 */
export type DeriveAbstractControl<T, V> = T extends TAbstractControl<V>
  ? T
  : FormControl<V>;

/**
 * A type extension that is used to derive the type of a `TFormGroup` based off of an
 * `AbstractControl` type. Will be undefined if the abstract control type isn't a form group.
 * @param V The raw value type of the abstract control.
 * @param A The abstract control type.
 */
export type DeriveFormGroupType<V, A> = A extends TFormGroup<V>
  ? A
  : undefined;

/**
 * A type extension that is used to derive the type of a `FormControl` based off of an
 * `AbstractControl` type. Will be undefined if the abstract control type isn't a form control.
 * @param V The raw value type of the abstract control.
 * @param A The abstract control type.
 */
export type DeriveFormControlType<V, A> = A extends FormControl<V>
  ? A
  : undefined;
