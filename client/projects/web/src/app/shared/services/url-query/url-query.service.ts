import { Injectable } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, ParamMap, Params, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { NEVER, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ReadRequest } from '~shared';

/**
 * A helper service used for querying and modifying parts of the URL.
 */
@Injectable({
  providedIn: 'root'
})
export class UrlQueryService {

  private _prevUrl = '';

  constructor(
    private _router: Router
  ) {
    // Track the previous URL to ensure that any query param change is not caused by a route change.
    this._prevUrl = this._router.url;
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this._prevUrl = event.url;
      }
    });
  }

  /**
   * Listens for a change in URL query paramaters and maps the params to a read request on change.
   * Will always emit the current query param snapshot upon initial setup.
   * @param activatedRoute The activated route service used to monitor changes to the URL.
   * @param defaultParams The optional default parameter values to assign when not explicitly set via URL query params.
   * @return An observable that emits the `ReadRequest` generated from an update to the URL query params.
   */
  listenQueryParamsChange<T extends ReadRequest>(activatedRoute: ActivatedRoute, defaultParams: Partial<T> = {}): Observable<T> {
    const initUrl: string = this._router.url;
    return activatedRoute.queryParams.pipe(
      switchMap((params: Params) => {
        // Check if this is triggered by a query param change and not a route change.
        return (this._prevUrl === initUrl)
          ? of(this.queryParamsToReadRequest<T>(params, defaultParams))
          : NEVER; // Do not emit a value (and do not terminate); the queryParams emission was due to a route change.
      })
    );
  }

  /**
   * Listens for changes to a given URL path parameter, attempts to convert it to a number if possible, and emits its value on change.
   * @param param The URL (path) parameter to listen for a change to.
   * @param activatedRoute The activated route service used to monitor changes to the URL.
   * @return An observable that emits the updated param value (converts it to a number if possible).
   */
  listenUrlParamChange<T extends number | string = string>(
    param: string,
    activatedRoute: ActivatedRoute
  ): Observable<T> {
    return activatedRoute.paramMap.pipe(
      filter((paramMap: ParamMap) => paramMap.has(param)),
      map((paramMap: ParamMap) => {
        const paramStr: string = paramMap.get(param);
        const paramNum: number = parseInt(paramStr, 10);
        return <T>(isNaN(paramNum) ? paramStr : paramNum);
      })
    );
  }

  /**
   * Converts (URL) query params to a generic ReadRequest.
   * @param params The query params that are to be converted.
   * @param defaultParams The default query param values that shall be assigned to any missing URL query params.
   * @return The `ReadRequest` result of the conversion.
   */
  queryParamsToReadRequest<T extends ReadRequest>(params: Params, defaultParams: any): T {
    const request: T = Object.assign(<any>cloneDeep(params), defaultParams);
    if (typeof params.page === 'string') {
      request.page = parseInt(params.page, 10);
    }
    if (typeof params.limit === 'string') {
      request.limit = parseInt(params.limit, 10);
    }
    return request;
  }

  /**
   * Updates the URL query string to contain given donation filter values.
   * @param filters The filter values that are to be set in the query string.
   * @param activatedRoute The activated route service used to complete query string modification on the current route.
   */
  updateUrlQueryString(filters: any, activatedRoute: ActivatedRoute): void {
    // Convert dates into raw ISO strings.
    for (const filtKey in filters) {
      if (filters[filtKey] instanceof Date) {
        filters[filtKey] = (<Date>filters[filtKey]).toISOString();
      }
    }

    this._router.navigate([], {
      relativeTo: activatedRoute,
      queryParams: filters
    });
  }
}
