import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, flatMap } from 'rxjs/operators';
import { environment } from '~web/environment';
import { ErrorHandlerService } from '~web/error-handler/error-handler.service';
import { PageProgressService } from '~web/page-progress/page-progress.service';
import { AlertService } from '~web/alert/alert.service';
import { Account, ListResponse, AccountUpdateRequest, PasswordUpdateRequest, AccountReadFilters, AccountReadRequest } from '~shared';

import { PasswordFormT } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/session.service';

export { Account };

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly url = `${environment.server}/account`;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService,
    private _pageProgressService: PageProgressService,
    private _alertService: AlertService
  ) {}

  updateAccount(originalAccount: Account, accountSectionUpdate: Partial<Account>): Observable<Account> {
    const accountUpdtReq: AccountUpdateRequest = this._genAccountUpdateRequest(originalAccount, accountSectionUpdate);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Account>(this.url, accountUpdtReq, { withCredentials: true }).pipe(
      map((savedAccount: Account) => this._handleAccountUpdateResponse(savedAccount)),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _genAccountUpdateRequest(originalAccount: Account, accountSectionUpdate: Partial<Account>): AccountUpdateRequest {
    const account: Account = Object.assign({}, originalAccount);
    Object.keys(accountSectionUpdate).forEach((property: string) => account[property] = accountSectionUpdate[property]);
    return { account };
  }

  private _handleAccountUpdateResponse(savedAccount: Account): Account {
    // If user has updated their own account, then update client's session storage.
    if (savedAccount.id === this._sessionService.account.id) {
      this._sessionService.account = savedAccount;
    }
    this._alertService.displaySimpleMessage('Account update successful', 'success');
    return savedAccount;
  }

  updatePassword(passwordUpdate: PasswordFormT): Observable<void> {
    const request: PasswordUpdateRequest = passwordUpdate;
    this._pageProgressService.activate(true);
    return this._httpClient.put<void>(`${this.url}/password`, request, { withCredentials: true }).pipe(
      map(() => this._alertService.displaySimpleMessage('Password update successful', 'success')),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  listenAccountQueryChange(activatedRoute: ActivatedRoute): Observable<Account> {
    return activatedRoute.paramMap.pipe(
      flatMap((paramMap: ParamMap) => {
        const id: number = (paramMap.has('id') ? parseInt(paramMap.get('id'), 10) : undefined);
        return this.getAccount(id);
      })
    );
  }

  getAccount(id: number): Observable<Account> {
    // Attempt to get account from session storage.
    if (id == null) {
      return of(this._sessionService.account);
    }
    // Attempt to get account from window state history.
    if (window.history.state && window.history.state.id === id) {
      return of(window.history.state);
    }
    // Get account from server.
    const url = `${this.url}/${id}`;
    return this._httpClient.get<Account>(url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  listenAccountsQueryChange(activatedRoute: ActivatedRoute): Observable<ListResponse<Account>> {
    return activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: AccountReadFilters = {};
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        const page: number = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
        const limit: number = (params.has('limit') ? parseInt(params.get('limit'), 10) : undefined);
        return this.getAccounts(filters, page, limit);
      })
    );
  }

  getAccounts(filters: AccountReadFilters, page = 1, limit = 10): Observable<ListResponse<Account>> {
    const request = <AccountReadRequest>filters;
    request.page = page;
    request.limit = limit;
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<ListResponse<Account>>(this.url, { params, withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
