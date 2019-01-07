import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { PageProgressService } from '../page-progress/page-progress.service';
import { AccountCreateRequest } from '../../../../../shared/src/interfaces/account-create-request';
import { Account } from '../../../../../shared/src/interfaces/account';
import { AccountUpdateRequest } from '../../../../../shared/src/interfaces/account-update-request';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService,
    private _pageProgressService: PageProgressService
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

  updateAccount(account: Account, password: string, oldPassword: string): void {
    const request: AccountUpdateRequest = { account, password, oldPassword };
    this._pageProgressService.activate(true);
    this._httpClient.put<Account>(
      '/server/account',
      request
    ).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._pageProgressService.reset())
    ).subscribe((savedAccount: Account) => this._sessionService.account = savedAccount);
  }
}
