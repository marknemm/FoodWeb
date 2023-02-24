import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * A typed version of the built-in `AbstractControl`.
 * @extends AbstractControl
 * @param T The type of the contained data.
 */
export interface TAbstractControl<T> extends AbstractControl {

  readonly status: ControlStatus;
  readonly statusChanges: Observable<ControlStatus>;

  readonly value: T;
  readonly valueChanges: Observable<T>;

  get(path: (string | number)[] | string): AbstractControl | null;
  setValue(value: T, options?: UpdateValueOptions): void;
  patchValue(value: Partial<T>, options?: UpdateValueOptions): void;
  reset(value?: FormState<T> | { [K in keyof T]?: FormState<T[K]> }, options?: UpdateValueOptions): void;
}

export interface UpdateValueOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
}

export type FormState<T> = Partial<T> | {
  value: T;
  disabled: boolean;
};

export type ControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';
