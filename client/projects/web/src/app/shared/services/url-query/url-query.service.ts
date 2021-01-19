import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReadRequest } from '~shared';

/**
 * A helper service used for querying and modifying parts of the URL.
 */
@Injectable({
  providedIn: 'root'
})
export class UrlQueryService {

  constructor(
    private _router: Router
  ) {}

  /**
   * Listens for a change in URL query paramaters and maps the params to a read request on change.
   * @param activatedRout The activated route service used to monitor changes to the URL.
   * @return An observable that emits the `ReadRequest` generated from an update to the URL query params.
   */
  listenQueryParamsChange<T extends ReadRequest>(activatedRoute: ActivatedRoute): Observable<T> {
    return activatedRoute.queryParams.pipe(
      map((params: Params) => this.queryParamsToReadRequest<T>(params))
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
   * @return The `ReadRequest` result of the conversion.
   */
  queryParamsToReadRequest<T extends ReadRequest>(params: Params): T {
    const request: T = <any>cloneDeep(params);
    request.page = (params.page ? parseInt(params.page, 10) : 1);
    request.limit = (params.limit ? parseInt(params.limit, 10) : 10);
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
