import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { Account, AccountReadFilters, AccountReadRequest, ListResponse } from '~shared';
import { environment } from '~web-env/environment';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class AccountReadService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _httpResponseService: HttpResponseService,
    private _httpClient: HttpClient,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  updateURLQueryString(filters: AccountReadRequest, activatedRoute: ActivatedRoute): void {
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

  /**
   * Handles URL param updates associated with retrieving a single account.
   * @param params The updated URL params.
   * @return An observable that emits the retrieved account based off of the updated URL parameters.
   */
  handleAccountQueryChange(params: Params): Observable<Account> {
    const id: number = (params.id ? parseInt(params.id, 10) : undefined);
    return this.getAccount(id);
  }

  /**
   * Gets an account based off of a given account ID.
   * @param id The ID of the account to retrieve.
   * @return An observable that emits the retrieved account from the server.
   */
  getAccount(id: number): Observable<Account> {
    // Attempt to get account from session storage.
    if (id == null) {
      return of(this._sessionService.account);
    }

    // Get account from server.
    const url = `${this.url}/${id}`;
    return this._httpClient.get<Account>(url, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }

  /**
   * Handles URL query param updates associated with fitlering retrieved accounts.
   * @param params The updated URL query params.
   * @return An observable that emits the retrieved account list based off of the updated URL query parameter filters.
   */
  handleAccountsQueryChange(params: Params): Observable<ListResponse<Account>> {
    const filters: AccountReadFilters = cloneDeep(params);
    const page: number = (params.page ? parseInt(params.page, 10) : undefined);
    const limit: number = (params.limit ? parseInt(params.limit, 10) : undefined);
    return this.getAccounts(filters, page, limit);
  }

  /**
   * Gets accounts based off of given filter and paging parameters.
   * @param filters The account read filters.
   * @param page The account paging index (1 based).
   * @param limit The number of accounts to retrieve on a single page.
   * @return An observable that emits the account list that was retrieved from the server.
   */
  getAccounts(filters: AccountReadFilters, page = 1, limit = 10): Observable<ListResponse<Account>> {
    const request = <AccountReadRequest>filters;
    request.page = page;
    request.limit = limit;
    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<ListResponse<Account>>(this.url, { params, withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse()
    );
  }
}
