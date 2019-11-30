import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export interface UpdateValueOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
}

export class TypedFormControl<T> extends FormControl {

  readonly value: T;
  readonly valueChanges: Observable<T>;

  constructor(
    formState?: Partial<T>,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  setValue(value: T, options?: UpdateValueOptions): void {
    super.setValue(value, options);
  }

  patchValue(value: T, options?: UpdateValueOptions): void {
    super.patchValue(value, options);
  }
}
