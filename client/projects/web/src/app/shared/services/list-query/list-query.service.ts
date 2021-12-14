import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, skip, take } from 'rxjs/operators';
import { ListResponse, ReadRequest } from '~shared';
import { ListFiltersForm } from '~web/shared/forms/list-filters.form';
import { ReadService } from '~web/shared/interfaces/read-service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

/**
 * A stateful service that queries the server for a list and maintains the associated query & response data.
 * @param T The type of data that is being queried.
 */
@Injectable()
export class ListQueryService<T> {

  private _filtersForm: ListFiltersForm;
  private _readService: ReadService;
  private _response$ = new BehaviorSubject<ListResponse<T>>({ list: [], totalCount: 0 });

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _urlQueryService: UrlQueryService
  ) {}

  /**
   * The most recently loaded list of items. An empty list if none have been loaded (yet).
   */
  get items(): readonly T[]              { return this._response$.value.list; }

  /**
   * An observable that emits the current list of loaded items, and each future loaded list of items.
   */
  get items$(): Observable<readonly T[]> { return this._response$.asObservable().pipe(map(() => this.items)); }

  /**
   * Whether or not items are currently being loaded.
   */
  get loading(): boolean                { return this._readService?.loading; }

  /**
   * Wether or not no items have been found.
   */
  get noneFound(): boolean              { return (!this.loading && this.totalCount === 0); }

  /**
   * The total count of items available to load, not factoring in any filters or pagination.
   */
  get totalCount(): number              { return this._response$.value.totalCount; }

  /**
   * Clears the list and total count of items.
   */
  clear(): void {
    this._response$.complete();
    this._response$ = new BehaviorSubject<ListResponse<T>>({ list: [], totalCount: 0 });
  }

  /**
   * Loads a list, and listens for URL query param changes in order to perform additional filtered loads.
   * @param readService The service that is used to perform the actual read query.
   * @param filtersForm The filters form which will contain the filters & pagination parameters that shall be applied on each load.
   * @returns An observable that emits the loaded list once the load operation has completed.
   */
  load(readService: ReadService, filtersForm: ListFiltersForm): Observable<readonly T[]> {
    this._readService = readService;
    this._filtersForm = filtersForm;
    this.clear();

    this._urlQueryService.listenQueryParamsChange<ReadRequest>(this._activatedRoute).subscribe(
      (request: ReadRequest) => {
        // Only refresh if filter request has new values.
        if (!isEqual(request, this._getReadRequest)) {
          this._filtersForm.reset(request);
          this.refresh();
        }
      }
    );

    return this._response$.asObservable().pipe(skip(1), take(1), map(() => this.items));
  }

  /**
   * Loads more entries within the list using the current filters and incrementing the page by 1.
   * @returns An observable that emits the updated list once the load operation has completed.
   */
  loadMore(): Observable<readonly T[]> {
    this._filtersForm.patchValue({ page: this._filtersForm.value.page + 1 });
    const request: ReadRequest = this._getReadRequest();

    this._readService.getMany(request, false).subscribe(
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
   * @param showPageProgressOnLoad Whether or not to show a page progress indicator on refresh. Defaults to true.
   * @returns An observable that emits the refreshed list once the refresh operation has completed.
   */
  refresh(showPageProgressOnLoad = true): Observable<readonly T[]> {
    this._filtersForm.get('page').setValue(1);
    const request: ReadRequest = this._getReadRequest();
    this._urlQueryService.updateUrlQueryString(request, this._activatedRoute);

    // Send request to server, and wait for response.
    this._readService.getMany(request, showPageProgressOnLoad).subscribe(
      (response: ListResponse<T>) => this._response$.next(response)
    );

    return this._response$.asObservable().pipe(skip(1), take(1), map(() => this.items));
  }

  /**
   * @returns The {@link ReadRequest} from the {@link FiltersForm}.
   */
  private _getReadRequest(): ReadRequest {
    // Check if there is a custom method defined for converting form value to read request.
    if (this._filtersForm.toReadRequest) {
      return this._filtersForm.toReadRequest();
    }

    // By default, get non-disabled form values, and filter out null values.
    const value = this._filtersForm.value;
    for (const prop in value) {
      if (value[prop] == null) { delete value[prop]; }
    }
    return value;
  }
}
