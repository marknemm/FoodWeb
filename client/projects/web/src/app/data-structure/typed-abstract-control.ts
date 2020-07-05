import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export abstract class TypedAbstractControl<T> extends AbstractControl {

  readonly value: T;
  readonly valueChanges: Observable<T>;

  abstract setValue(value: T, options?: { onlySelf?: boolean, emitEvent?: boolean }): void;
  abstract patchValue(value: T, options?: { onlySelf?: boolean, emitEvent?: boolean }): void;
}
