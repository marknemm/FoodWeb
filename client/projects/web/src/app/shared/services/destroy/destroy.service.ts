import { Injectable, OnDestroy } from '@angular/core';
import { Observable, OperatorFunction, Subject, merge, takeUntil } from 'rxjs';

@Injectable()
export class DestroyService implements OnDestroy {

  /**
   * An RxJs {@link Observable} destroy trigger that emits a value during the {@link ngOnDestroy} lifecycle hook invocation.
   */
  readonly destroy$ = new Subject<void>();

  /**
   * Cleanup all RxJS subscriptions associated with this service and provider component ({@link untilDestroy}).
   * Automatically invoked when the component provider is destroyed (removed from DOM).
   */
  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  /**
   * Generates a pipeable RxJs operator that is shorthand for `takeUntil(this._destroy$)`.
   *
   * `this.destroy$.next()` shall be invoked during {@link ngOnDestroy}, which will cause any piped observable to unsubscribe.
   *
   * @usageNotes
   * ### Auto-unsubscribe
   *
   * The following example results in an observable that auto-unsubscribes during `ngOnDestroy`.
   *
   * ```ts
   *   myObservable$.pipe(this.untilDestroy()).subscribe((value: any) => {
   *     ...
   *   });
   * ```
   *
   * @param extraDestroy$ Optional extra observable(s) that will trigger the completion of the source observable.
   * @returns The pipe operator function.
   */
  untilDestroy<A>(...extraDestroy$: Observable<any>[]): OperatorFunction<A, A> {
    const destroy$: Observable<any> = (extraDestroy$.length)
      ? merge(this.destroy$, ...extraDestroy$)
      : this.destroy$;
    return (source: Observable<A>) => source.pipe(takeUntil(destroy$));
  }
}
