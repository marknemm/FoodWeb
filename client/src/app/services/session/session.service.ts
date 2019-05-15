import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { LoginRequest } from '../../../../../shared/src/interfaces/session/login-request';
import { AccountHelper, Account } from '../../../../../shared/src/helpers/account-helper';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly url = 'server/session';

  private _account: Account;
  private _loading = false;
  private _loginErr: string;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _accountHelper: AccountHelper
  ) {
    // Attempt to get account from local browser storage upon init.
    const jsonAccount: string = localStorage.getItem('account');
    this._account = (jsonAccount ? JSON.parse(jsonAccount) : null);
  }

  get accountId(): number {
    return (this._account ? this._account.id : undefined);
  }

  get account(): Account {
    return this._account;
  }

  set account(account: Account) {
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    } else {
      localStorage.removeItem('account');
    }
    this._account = account;
  }

  get loading(): boolean {
    return this._loading;
  }

  get loggedIn(): boolean {
    return this._account != null;
  }

  get isAdmin(): boolean {
    return this._accountHelper.isAdmin(this.account);
  }

  get isDonor(): boolean {
    return this._accountHelper.isDonor(this.account);
  }

  get isReceiver(): boolean {
    return this._accountHelper.isReceiver(this.account);
  }

  get isVolunteer(): boolean {
    return this._accountHelper.isVolunteer(this.account);
  }

  get loginErr(): string {
    return this._loginErr;
  }

  isMyAccount(accountId: number, ignoreAdmin = false): boolean {
    return this._accountHelper.isMyAccount(this.account, accountId, ignoreAdmin);
  }

  login(usernameEmail: string, password: string): Observable<void> {
    const loginRequest: LoginRequest = { usernameEmail, password };
    this._loading = true;
    this._loginErr = null;
    return this._httpClient.post<Account>(this.url, loginRequest).pipe(
      map((account: Account) => { this.account = account; }),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        this._loginErr = err.error.message;
        return EMPTY;
      }),
      finalize(() => this._loading = false)
    );
  }

  logout(): void {
    this._loading = true;
    this._httpClient.delete<void>(this.url).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err)),
      finalize(() => this._loading = false)
    ).subscribe(
      () => this.account = null
    );
  }
}
