import { FormGroup, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

import { TypedAbstractControl } from '~web/data-structure/typed-abstract-control';

export class TypedFormGroup<T> extends FormGroup {

  readonly controls: { [K in keyof T]?: TypedAbstractControl<T[K]> };
  readonly value: T;
  readonly valueChanges: Observable<T>;

  constructor(
    controls: {
      [K in keyof T]?:
          T[K]
        | TypedAbstractControl<T[K]>
        | [T[K]]
        | [T[K], ValidatorFn]
        | [T[K], ValidatorFn[]]
    },
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    const formBuilder = new FormBuilder();
    const rawFormGroup: FormGroup = formBuilder.group(controls);
    super(rawFormGroup.controls, validatorOrOpts, asyncValidator);
  }

  get<K extends Extract<keyof T, string>>(name: K | K[]): TypedAbstractControl<T[K]> {
    return super.get(name);
  }

  getRawValue(): T {
    return super.getRawValue();
  }

  setValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    super.setValue(value, options);
  }

  patchValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    if (value) {
      super.patchValue(value, options);
    }
  }

  addControl<K extends Extract<keyof T, string>>(name: K, control: TypedAbstractControl<T[K]>): void {
    super.addControl(name, control);
  }

  removeControl(name: Extract<keyof T, string>): void {
    super.removeControl(name);
  }

  setControl<K extends Extract<keyof T, string>>(name: K, control: TypedAbstractControl<T[K]>): void {
    super.setControl(name, control);
  }

  reset(value?: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean; }): void {
    super.reset(value, options);
  }
}
