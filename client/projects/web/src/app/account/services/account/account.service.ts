import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, flatMap, map } from 'rxjs/operators';
import { Account, AccountReadFilters, AccountReadRequest, AccountSectionUpdateReqeust, ListResponse, PasswordUpdateRequest } from '~shared';
import { AccountFormKey } from '~web/account/forms/account.form';
import { environment } from '~web/environments/environment';
import { PasswordFormT } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/session/session.service';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
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

  updateAccountSection(account: Account, secitonName: keyof Account): Observable<Account> {
    const url = `${this.url}/${account.id}/section`;
    const accountSectionUpdtReq: AccountSectionUpdateReqeust = { accountSectionName: secitonName, accountSection: account[secitonName] };
    this._pageProgressService.activate(true);
    return this._httpClient.put<Account>(url, accountSectionUpdtReq, { withCredentials: true }).pipe(
      map((savedAccount: Account) => this._handleAccountUpdateResponse(savedAccount)),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _handleAccountUpdateResponse(savedAccount: Account): Account {
    // If user has updated their own account, then update client's session storage.
    if (savedAccount.id === this._sessionService.account.id) {
      this._sessionService.account = savedAccount;
    }
    this._alertService.displaySimpleMessage('Account update successful', 'success');
    return savedAccount;
  }

  updatePassword(account: Account, passwordUpdate: PasswordFormT): Observable<void> {
    const url = `${this.url}/${account.id}/password`;
    const request: PasswordUpdateRequest = passwordUpdate;
    this._pageProgressService.activate(true);
    return this._httpClient.put<void>(url, request, { withCredentials: true }).pipe(
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
    if (window.history.state?.account?.id === id) {
      return of(window.history.state.account);
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
