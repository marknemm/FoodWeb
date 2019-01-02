import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AccountCreateRequest } from './../../../../../shared/src/interfaces/account-create-request';
import { Account } from './../../../../../shared/src/interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService
  ) {}

  createAccount(account: Account, password: string): void {
    const request: AccountCreateRequest = { account, password };
    this._httpClient.post<Account>(
      '/server/account',
      request
    ).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    ).subscribe((savedAccount: Account) => this._sessionService.account = savedAccount);
  }
}
