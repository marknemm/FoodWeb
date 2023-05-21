import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { merge, Observable, Subscriber } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UpdateValueOptions } from '~web/forms';

/**
 * A utility service that provides `AbstractControl` monitoring capabilities.
 */
@Injectable({
  providedIn: 'root'
})
export class FormMonitorService {

  /**
   * Listens for `disable` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits when `disable` is invoked on the given `control`.
   */
  onDisable(control: AbstractControl): Observable<void> {
    control['onDisable'] ??= new Observable((subscriber: Subscriber<void>) => {
      const origDisable = control.disable.bind(control);
      control.disable = () => {
        origDisable();
        subscriber.next();
      };
    });
    return control['onDisable'];
  }

  /**
   * Listens for `disable` or `enable` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the disabled state when `disable` or `enable` is invoked on the given `control`.
   */
  onDisableEnable(control: AbstractControl): Observable<boolean> {
    control['onDisableEnable'] ??= merge(
      this.onDisable(control).pipe(map(() => true)),
      this.onEnable(control).pipe(map(() => false))
    );
    return control['onDisableEnable'];
  }

  /**
   * Listens for `enable` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits when `enable` is invoked on the given `control`.
   */
  onEnable(control: AbstractControl): Observable<void> {
    control['onEnable'] ??= new Observable((subscriber: Subscriber<void>) => {
      const origEnable = control.enable.bind(control);
      control.enable = () => {
        origEnable();
        subscriber.next();
      };
    });
    return control['onEnable'];
  }

  /**
   * Listens for `markAllAsTouched` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits when `markAllAsTouched` is invoked on the given `control`.
   */
  onMarkAllAsTouched(control: AbstractControl): Observable<void> {
    control['onMarkAllAsTouched'] ??= new Observable<void>((subscriber: Subscriber<void>) => {
      const origMarkAllAsTouched = control.markAllAsTouched.bind(control);
      control.markAllAsTouched = () => {
        origMarkAllAsTouched();
        subscriber.next();
      };
    });
    return control['onMarkAllAsTouched'];
  }

  /**
   * Listens for `markAsDirty` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the options used when a call to `markAsDirty` is made on the given `control`.
   */
  onMarkAsDirty(control: AbstractControl): Observable<{ onlySelf?: boolean }> {
    control['onMarkAsDirty'] ??= new Observable((subscriber: Subscriber<{ onlySelf?: boolean }>) => {
      const origMarkAsDirty = control.markAsDirty.bind(control);
      control.markAsDirty = (opts: { onlySelf?: boolean }) => {
        origMarkAsDirty(opts);
        subscriber.next(opts);
      };
    });
    return control['onMarkAsDirty'];
  }

  /**
   * Listens for `markAsPending` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the options used when a call to `markAsPending` is made on the given `control`.
   */
  onMarkAsPending(control: AbstractControl): Observable<{ onlySelf?: boolean; emitEvent?: boolean }>  {
    control['onMarkAsPending'] ??= new Observable((subscriber: Subscriber<{ onlySelf?: boolean; emitEvent?: boolean }>) => {
      const origMarkAsPending = control.markAsPending.bind(control);
      control.markAsPending = (opts: { onlySelf?: boolean; emitEvent?: boolean }) => {
        origMarkAsPending(opts);
        subscriber.next(opts);
      };
    });
    return control['onMarkAsPending'];
  }

  /**
   * Listens for `markAsPristine` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the options used when a call to `markAsPristine` is made on the given `control`.
   */
  onMarkAsPristine(control: AbstractControl): Observable<{ onlySelf?: boolean }> {
    control['onMarkAsPristine'] ??= new Observable((subscriber: Subscriber<{ onlySelf?: boolean }>) => {
      const origMarkAsPristine = control.markAsPristine.bind(control);
      control.markAsPristine = (opts: { onlySelf?: boolean }) => {
        origMarkAsPristine(opts);
        subscriber.next(opts);
      };
    });
    return control['onMarkAsPristine'];
  }

  /**
   * Listens for `markAsTouched` or `markAllAsTouched` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the options used when a call to `markAsTouched` is made on the given `control`.
   */
  onMarkAsTouched(control: AbstractControl): Observable<{ onlySelf?: boolean }> {
    control['onMarkAsTouched'] ??= <Observable<{ onlySelf?: boolean }>>merge(
      new Observable((subscriber: Subscriber<{ onlySelf?: boolean }>) => {
        const origMarkAsTouched = control.markAsTouched.bind(control);
        control.markAsTouched = (opts: { onlySelf?: boolean }) => {
          origMarkAsTouched(opts);
          subscriber.next(opts);
        };
      }),
      this.onMarkAllAsTouched(control)
    );
    return control['onMarkAsTouched'];
  }

  /**
   * Listens for `markAsUntouched` to be invoked on a given `AbstractControl`.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the options used when a call to `markAsUntouched` is made on the given `control`.
   */
  onMarkAsUntouched(control: AbstractControl): Observable<{ onlySelf?: boolean }> {
    control['onMarkAsUntouched'] ??= new Observable((subscriber: Subscriber<{ onlySelf?: boolean }>) => {
      const origMarkAsUntouched = control.markAsUntouched.bind(control);
      control.markAsUntouched = (opts: { onlySelf?: boolean }) => {
        origMarkAsUntouched(opts);
        subscriber.next(opts);
      };
    });
    return control['onMarkAsUntouched'];
  }

  /**
   * Listens for `patchValue` to be invoked on a given `AbstractControl` regardless of the `emitEvent` config.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the value & options used when a call to `patchValue` is made on the given `control`.
   */
  onPatchValue<T>(control: AbstractControl): Observable<{ value: T; options: any }> {
    control['onPatchValue'] ??= new Observable((subscriber: Subscriber<{ value: any; options: any }>) => {
      const origPatchValue = control.patchValue.bind(control);
      control.patchValue = (value: any, options: any) => {
        origPatchValue(value, options);
        subscriber.next({ value, options });
      };
    });
    return control['onPatchValue'];
  }

  /**
   * Listens for `patchValue`, `reset`, or `setValue` to be invoked on a given `AbstractControl` regardless of the `emitEvent` config.
   * Also, listens for all emitted `valueChanges` events due to user input.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the value & options used when a call to `patchValue` or `setValue` is made on the given `control`.
   */
  onMutateValue<T>(control: AbstractControl<T>): Observable<T> {
    control['onMutateValue'] ??= merge(
      merge(
        this.onPatchValue<T>(control),
        this.onReset<T>(control),
        this.onSetValue<T>(control)
      ).pipe(
        filter((event: { value: T, options: UpdateValueOptions }) => event.options?.emitEvent === false),
        map((event: { value: T, options: UpdateValueOptions }) => event.value)
      ),
      control.valueChanges
    );
    return control['onMutateValue'];
  }

  /**
   * Listens for `reset` to be invoked on a given `AbstractControl` regardless of the `emitEvent` config.
   * @param control The `AbstractControl` to monitor.
   * @returns An observable that emits the value & options used when a call to `reset` is made on the given `control`.
   */
  onReset<T>(control: AbstractControl<T>): Observable<{ value: T; options: any }> {
    control['onReset'] ??= new Observable((subscriber: Subscriber<{ value: any; options: any }>) => {
      const origReset = control.reset.bind(control);
      control.reset = (value?: any, options?: any) => {
        origReset(value, options);
        subscriber.next({ value, options });
      };
    });
    return control['onReset'];
  }

  /**
   * Listens for `setValue` to be invoked on a given `AbstractControl` regardless of the `emitEvent` config.
   * @param control The `AbstractControl` to monitor.
   * @return An observable that emits the value & options used when a call to `setValue` is made on the given `control`.
   */
  onSetValue<T>(control: AbstractControl<T>): Observable<{ value: T; options: any }> {
    control['onSetValue'] ??=  new Observable((subscriber: Subscriber<{ value: any; options: any }>) => {
      const origSetValue = control.setValue.bind(control);
      control.setValue = (value: any, options: any) => {
        origSetValue(value, options);
        subscriber.next({ value, options });
      };
    });
    return control['onSetValue'];
  }
}
