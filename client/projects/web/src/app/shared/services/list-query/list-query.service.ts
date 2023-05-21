import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map, skip, take, takeUntil } from 'rxjs/operators';
import { ListResponse, ReadRequest } from '~shared';
import { Controls } from '~web/forms';
import { FormAdapter } from '~web/forms/classes/form-adapter';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { HttpResponseHandlerOptions } from '../http-response/http-response.service';

/**
 * A stateful service that queries the server for a list and maintains the associated query & response data.
 * @param T The type of data that is being queried.
 */
@Injectable()
export class ListQueryService<T> implements OnDestroy {

  private _filtersForm: FormGroup<{ page: FormControl<number> }>;
  private _formAdapter: FormAdapter<{ page?: number }, any>;
  private _loading = false;
  private _reader: Reader<T>;
  private _response$ = new BehaviorSubject<ListResponse<T>>({ list: [], totalCount: 0 });

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _urlQueryService: UrlQueryService,
  ) {}

  /**
   * The most recently loaded list of items. An empty list if none have been loaded (yet).
   */
  get items(): readonly T[] { return this._response$.value.list; }

  /**
   * An observable that emits the current list of loaded items, and each future loaded list of items.
   */
  get items$(): Observable<readonly T[]> { return this._response$.asObservable().pipe(map(() => this.items)); }

  /**
   * Whether or not items are currently being loaded.
   */
  get loading(): boolean { return this._loading; }

  /**
   * Wether or not no items have been found.
   */
  get noneFound(): boolean { return (!this.loading && this.totalCount === 0); }

  /**
   * The total count of items available to load, not factoring in any filters or pagination.
   */
  get totalCount(): number { return this._response$.value.totalCount; }

  /**
   * Clears the list and total count of items.
   */
  clear(): void {
    this._response$.complete();
    this._response$ = new BehaviorSubject<ListResponse<T>>({ list: [], totalCount: 0 });
  }

  /**
   * Loads a list, and listens for URL query param changes in order to perform additional filtered loads.
   * @param readerFn The function that is used to perform the actual (single) read query.
   * @param filtersForm The filters form which will contain the filters & pagination parameters that shall be applied on each load.
   * @param formAdapter The adapter for the given `filtersForm`, which is used to generate the filter read request model from the form.
   * @returns An observable that emits the loaded list once the load operation has completed.
   */
  load<
    FILTER_T extends ReadRequest,
    FILTER_VIEW_MODEL_T extends { page: number },
    FILTER_CONTROLS_T extends Controls<FILTER_VIEW_MODEL_T>
  >(
    readerFn: Reader<T>,
    filtersForm: FormGroup<FILTER_CONTROLS_T>,
    formAdapter: FormAdapter<FILTER_T, FILTER_VIEW_MODEL_T>
  ): Observable<readonly T[]> {
    this._reader = readerFn;
    this._filtersForm = filtersForm as any;
    this._formAdapter = formAdapter as any;
    this.clear();

    // Ensure initial filter values are set in URL query string without changing history.
    const request: ReadRequest = this._getReadRequest();
    this._urlQueryService.updateUrlQueryString(request, this._activatedRoute, { replaceUrl: true });

    this._urlQueryService.listenQueryParamsChange<ReadRequest>(this._activatedRoute).subscribe(
      (request: ReadRequest) => {
        // Only refresh if filter request has new values.
        const prevRequest: ReadRequest = this._getReadRequest();
        if (!isEqual(request, prevRequest)) {
          this._filtersForm.reset(request);
          // Preserve the page in new request if result of pagination or page size (limit) change.
          this.refresh({ preservePage: (prevRequest.page !== request.page) || (prevRequest.limit !== request.limit) });
        }
      }
    );

    return this._response$.asObservable().pipe(skip(1), take(1), map(() => this.items));
  }

  /**
   * Loads more entries within the list using the current filters and incrementing the page by 1.
   * @param opts {@link RefreshOptions} for the HTTP response handler. Show loader defaults to false if not explicitly set.
   * @returns An observable that emits the updated list once the load operation has completed.
   */
  loadMore(opts: RefreshOptions = { showLoader: false }): Observable<readonly T[]> {
    this._filtersForm.patchValue({ page: (this._filtersForm.value.page + 1) });
    this._loading = true;
    opts.showLoader ??= false;
    const request: ReadRequest = this._getReadRequest();

    this._reader(request, opts).pipe(
      finalize(() => {
        this._loading = false;
        if (opts.complete) {
          opts.complete();
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe(
      (response: ListResponse<T>) => {
        // Must iteratively add in-place so no blink in ion-virtual-scroll.
        const newItems: T[] = response.list;
        response.list = this._response$.value.list;
        for (const item of newItems) {
          response.list.push(item);
        }
        this._response$.next(response);
      }
    );

    return this._response$.asObservable().pipe(skip(1), take(1), map(() => this.items));
  }

  /**
   * Refreshes the list items using the current filters and resetting the page to 1.
   * @param opts {@link RefreshOptions} for the HTTP response handler.
   * @returns An observable that emits the refreshed list once the refresh operation has completed.
   */
  refresh(opts: RefreshOptions = {}): Observable<readonly T[]> {
    if (this._filtersForm.controls.page.value > 1 && !opts.preservePage) {
      this._filtersForm.controls.page.setValue(1);
    }
    this._loading = true;
    const request: ReadRequest = this._getReadRequest();
    this._urlQueryService.updateUrlQueryString(request, this._activatedRoute);

    // Send request to server, and wait for response.
    this._reader(request, opts).pipe(
      finalize(() => {
        this._loading = false;
        if (opts.complete) {
          opts.complete();
        }
      }),
      takeUntil(this._destroy$)
    ).subscribe(
      (response: ListResponse<T>) => this._response$.next(response)
    );

    return this._response$.asObservable().pipe(skip(1), take(1), map(() => this.items));
  }

  /**
   * @returns The {@link ReadRequest} from the {@link FiltersForm}.
   */
  private _getReadRequest(): ReadRequest {
    // By default, get non-disabled form values, and filter out null values.
    const value: ReadRequest = this._formAdapter.toModel(this._filtersForm);
    for (const prop in value) {
      if (value[prop] == null) { delete value[prop]; }
    }
    return value;
  }

  ngOnDestroy(): void {
      this._destroy$.next();
      this._response$.complete();
  }
}

export type Reader<T> = (request: ReadRequest<any>, showLoader?: HttpResponseHandlerOptions<ListResponse<T>>) => Observable<ListResponse<T>>;
export type RefreshOptions = HttpResponseHandlerOptions & {
  /**
   * Whether or not to preserve the current page. Defaults to false and resets the page to 1.
   */
  preservePage?: boolean;
  /**
   * An optional callback that is invoked when the refresh operation is complete.
   */
  complete?: () => void
};

export type ReadRequestFormData = Omit<Required<ReadRequest>, ''>;
