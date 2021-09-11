import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { TAbstractControl } from '..';
import { FormState, UpdateValueOptions } from './t-abstract-control';

/**
 * A typed version of the built-in `FormControl`.
 * @extends FormControl
 * @param T The type of the contained data.
 */
export class TFormControl<T> extends FormControl implements TAbstractControl<T> {

  /**
   * The current value contained within this `TFormControl`.
   */
  readonly value: T;

  /**
   * An observable that emits the value of this `TFormControl` each time it changes in the UI or programmatically.
   * Also emits an event each time you call `enable()` or `disable()` without passing in the `emitEvent: false` option.
   */
  readonly valueChanges: Observable<T>;

  /**
   * Creates a new `TFormControl` instance.
   * @param formState The initial value, or an object that contains the initial value and disabled state.
   * @param validatorOrOpts A synchronous validator function, an array of such functions,
   * or an `AbstractControlOptions` object that contains validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  constructor(
    formState?: FormState<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[],
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  /**
   * Patches the value of a control.
   *
   * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
   * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
   * `FormArrays`, where it does behave differently.
   *
   * @see `setValue` for parameter docs.
   */
  patchValue(value: T, options?: SetFormControlOptions): void {
    super.patchValue(value, options);
  }

  /**
   * Resets the form control to a specified value/state. Marks it `pristine` and `untouched`.
   * @param formState Resets the control with a value, or an object that defines the value and disabled state. Defaults to undefined.
   * @param options Configuration options that determine how the control propagates changes and emits events after the value changes.
   *
   * - `onlySelf`: When true, each change only affects this control, and not its parent. Default is false.
   * - `emitEvent`: When true or not supplied (the default), both the `statusChanges` and `valueChanges` observables
   * emit events with the latest status and value when the control is reset. When false, no events are emitted.
   *
   */
  reset(formState?: FormState<T>, options?: UpdateValueOptions): void {
    super.reset(formState, options);
  }

  /**
   * Sets a new value for the form control.
   * @param value The new value for the control.
   * @param options Configuration options that determine how the control propagates changes and emits events when the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   *
   * - `onlySelf`: When true, each change only affects this control, and not its parent. Default is false.
   * - `emitEvent`: When true or not supplied (the default), both the `statusChanges` and `valueChanges` observables emit events with
   * the latest status and value when the control value is updated. When false, no events are emitted.
   * - `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an `onChange` event to update the view.
   * - `emitViewToModelChange`: When true or not supplied (the default), each change triggers an `ngModelChange` event to update the model.
   */
  setValue(value: T, options?: SetFormControlOptions): void {
    super.setValue(value, options);
  }
}

export interface SetFormControlOptions extends UpdateValueOptions {
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}
