import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { PageProgressService } from '../page-progress/page-progress.service';
import { AlertService } from '../alert/alert.service';
import { AccountCreateRequest } from '../../../../../shared/src/interfaces/account-create-request';
import { AccountUpdateRequest } from '../../../../../shared/src/interfaces/account-update-request';
import { Account } from '../../../../../shared/src/interfaces/account';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService,
    private _pageProgressService: PageProgressService,
    private _alertService: AlertService
  ) {}

  createAccount(account: Account, password: string): void {
    const request: AccountCreateRequest = { account, password };
    this._pageProgressService.activate(true);
    this._httpClient.post<Account>(
      '/server/account',
      request
    ).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    ).subscribe((savedAccount: Account) => this._sessionService.account = savedAccount);
  }

  updateAccount(accountUpdateProps: string[], accountUpdate: Account, passwordUpdate: { password: string; oldPassword: string }): Observable<Account> {
    const request: AccountUpdateRequest = this._genAccountUpdateRequest(accountUpdateProps, accountUpdate, passwordUpdate);
    this._pageProgressService.activate(true);
    return this._httpClient.put<Account>(
      '/server/account',
      request
    ).pipe(
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
}
