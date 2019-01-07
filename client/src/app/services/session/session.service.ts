import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ErrorHandlerService } from './../error-handler/error-handler.service';
import { LoginRequest } from './../../../../../shared/src/interfaces/login-request';
import { Account } from './../../../../../shared/src/interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _account: Account;
  private _loading = false;
  private _loginErr: string;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService
  ) {
    // Attempt to get account from local browser storage upon init.
    const jsonAccount: string = localStorage.getItem('account');
    this._account = (jsonAccount ? JSON.parse(jsonAccount) : null);
  }

  get account(): Account {
    return this._account;
  }

  set account(account: Account) {
    localStorage.setItem('account', JSON.stringify(account));
    this._account = account;
  }

  get loading(): boolean {
    return this._loading;
  }

  get loggedIn(): boolean {
    return this._account != null;
  }

  get loginErr(): string {
    return this._loginErr;
  }

  login(usernameEmail: string, password: string): Observable<void> {
    const loginRequest: LoginRequest = { usernameEmail, password };
    this._loading = true;
    this._loginErr = null;
    return this._httpClient.post<Account>(
      '/server/session',
      loginRequest
    ).pipe(
      map((account: Account) => { this.account = account; }),
      catchError((err: HttpErrorResponse) => {
        this._loginErr = err.error.message;
        return EMPTY;
      }),
      finalize(() => this._loading = false)
    );
  }

  logout(): void {
    this._loading = true;
    this._httpClient.delete<void>(
      '/server/session'
    ).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loading = false)
    ).subscribe(() => {
      localStorage.removeItem('account');
      this.account = null;
    });
  }
}
