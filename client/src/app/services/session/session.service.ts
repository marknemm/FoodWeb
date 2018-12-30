import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from './../../../../../shared/src/interfaces/login-request';
import { Account } from './../../../../../shared/src/interfaces/account';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private _account: Account;

  constructor(
    private _httpClient: HttpClient
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

  get loggedIn(): boolean {
    return this._account != null;
  }

  login(email: string, password: string): Observable<void> {
    const loginRequest: LoginRequest = { email, password };
    return this._httpClient.post<Account>(
      '/server/session',
      loginRequest,
      { withCredentials: true }
    ).pipe(
      map((account: Account) => {
        this.account = account;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('account');
    this.account = null;
  }
}
