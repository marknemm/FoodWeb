import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * A typed version of the built-in `AbstractControl`.
 * @extends AbstractControl
 * @param T The type of the contained data.
 */
export abstract class TAbstractControl<T> extends AbstractControl {

  readonly value: T;
  readonly valueChanges: Observable<T>;

  abstract destroy(): void;
  abstract setValue(value: Partial<T>, options?: UpdateValueOptions): void;
  abstract patchValue(value: Partial<T>, options?: UpdateValueOptions): void;
}

// Enhance type declaration for AbstractControl.
declare module '@angular/forms' {
  interface AbstractControl {
    destroy(): void;
  }
}

export interface UpdateValueOptions {
  onlySelf?: boolean;
  emitEvent?: boolean;
}

export type FormState<T> = T | {
  value: T;
  disabled: boolean;
};
