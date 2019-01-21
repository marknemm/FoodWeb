import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, flatMap } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { PageProgressService } from '../page-progress/page-progress.service';
import { AlertService } from '../alert/alert.service';
import { AccountCreateRequest } from '../../../../../shared/src/interfaces/account-create-request';
import { AccountUpdateRequest } from '../../../../../shared/src/interfaces/account-update-request';
import { AccountReadRequest, AccountReadFilters } from '../../../../../shared/src/interfaces/account-read-request';
import { Account } from '../../../../../shared/src/interfaces/account';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly url = '/server/account';
  readonly accountReadLimit = 1000;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService,
    private _pageProgressService: PageProgressService,
    private _alertService: AlertService,
    private _activatedRoute: ActivatedRoute
  ) {}

  createAccount(account: Account, password: string): void {
    const request: AccountCreateRequest = { account, password };
    this._pageProgressService.activate(true);
    this._httpClient.post<Account>(this.url, request).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    ).subscribe((savedAccount: Account) => this._sessionService.account = savedAccount);
  }

  updateAccount(accountUpdateProps: string[], accountUpdate: Account, passwordUpdate: { password: string; oldPassword: string }): Observable<Account> {
    const request: AccountUpdateRequest = this._genAccountUpdateRequest(accountUpdateProps, accountUpdate, passwordUpdate);
    console.log(request);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Account>(this.url, request).pipe(
      map((savedAccount: Account) => {
        this._sessionService.account = savedAccount;
        this._alertService.displaySimpleMessage('Account update successful', 'success');
        return this._sessionService.account;
      }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }

  private _genAccountUpdateRequest(accountUpdateProps: string[], accountUpdate: Account, passwordUpdate: { password: string; oldPassword: string }): AccountUpdateRequest {
    const { password, oldPassword } = passwordUpdate;
    const account: Account = Object.assign({}, this._sessionService.account);
    accountUpdateProps.forEach((property: string) => account[property] = accountUpdate[property]);
    return { account, password, oldPassword };
  }

  listenAccoundQueryChange(): Observable<Account> {
    return this._activatedRoute.queryParamMap.pipe(
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
    return this.getAccounts({ id }).pipe(
      map((accounts: Account[]) => accounts[0])
    );
  }

  listenAccountsQueryChange(): Observable<Account[]> {
    return this._activatedRoute.queryParamMap.pipe(
      flatMap((params: ParamMap) => {
        const filters: AccountReadFilters = {};
        params.keys.forEach((paramKey: string) => {
          if (paramKey !== 'page') {
            filters[paramKey] = params.get(paramKey);
          }
        });
        const page: number = (params.has('page') ? parseInt(params.get('page'), 10) : undefined);
        return this.getAccounts(filters, page);
      })
    );
  }

  getAccounts(filters: AccountReadFilters, page = 1): Observable<Account[]> {
    const request = <AccountReadRequest>filters;
    request.page = page;
    request.limit = this.accountReadLimit;
    const params = new HttpParams({ fromObject: <any>request });
    this._pageProgressService.activate(true);
    return this._httpClient.get<Account[]>(this.url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    );
  }
}
