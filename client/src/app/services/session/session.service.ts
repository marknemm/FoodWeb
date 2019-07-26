import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { AlertService } from '../alert/alert.service';
import { LoginRequest } from '../../../../../shared/src/interfaces/session/login-request';
import { AccountHelper, Account } from '../../../../../shared/src/helpers/account-helper';
import { ServerSideEventSourceService } from '../server-side-event-source/server-side-event-source.service';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly url = 'server/session';

  private _account: Account;
  private _loading = false;

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService,
    private _serverSideEventService: ServerSideEventSourceService,
    private _accountHelper: AccountHelper
  ) {
    // Attempt to get account from local browser storage upon init.
    const jsonAccount: string = localStorage.getItem('account');
    this._account = (jsonAccount ? JSON.parse(jsonAccount) : null);
  }

  /**
   * The ID of the current user's account. undefined if the user is not logged in.
   */
  get accountId(): number {
    return (this._account ? this._account.id : undefined);
  }

  /**
   * The current user's account. null if the user is not logged in.
   */
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

  /**
   * Whether or not the service is performing a 'loading' operation on the server.
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Whether or not the user is logged in.
   */
  get loggedIn(): boolean {
    return this._account != null;
  }

  /**
   * Whether or not the user is an admin.
   */
  get isAdmin(): boolean {
    return this._accountHelper.isAdmin(this.account);
  }

  /**
   * Whether or not the user is a donor.
   */
  get isDonor(): boolean {
    return this._accountHelper.isDonor(this.account);
  }

  /**
   * Whether or not the user is a receiver.
   */
  get isReceiver(): boolean {
    return this._accountHelper.isReceiver(this.account);
  }

  /**
   * Whether or not the user is a volunteer.
   */
  get isVolunteer(): boolean {
    return this._accountHelper.isVolunteer(this.account);
  }

  /**
   * Checks if an account is the current user's account.
   * @param accountId The ID of the account to check.
   * @param ignoreAdmin Set to true to ignore admin privileges; admins technically own all accounts (default is false).
   * @return true if the account is the current user's account, false if not.
   */
  isMyAccount(accountId: number, ignoreAdmin = false): boolean {
    return this._accountHelper.isMyAccount(this.account, accountId, ignoreAdmin);
  }

  /**
   * Attempts to log the user in. Implicitly opens a server side event connection on login success.
   * @param username The username of the user.
   * @param password The passwsord of the user.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(username: string, password: string): Observable<Account> {
    const loginRequest: LoginRequest = { username, password };
    this._loading = true;
    return this._httpClient.post<Account>(this.url, loginRequest).pipe(
      map((account: Account) => this._handleLoginSuccess(account)),
      finalize(() => this._loading = false)
    );
  }

  /**
   * Handles the successful login of a user by setting up session data in the browser and opening a server side event client connection.
   * @param account The newly logged in user's account.
   * @param isSessionRefresh Set to true if the logout is from a session refresh operation. Default is false.
   * @return The logged in user's account.
   */
  private _handleLoginSuccess(account: Account, isSessionRefresh = false): Account {
    this.account = account;
    this._serverSideEventService.open();
    if (!isSessionRefresh) {
      this._alertService.displaySimpleMessage(`Welcome, ${this._accountHelper.accountName(account)}`, 'success');
    }
    return account;
  }

  /**
   * Refreshes the session status so that it is in-sync with the user's session status on the server.
   * Implicitly opens/closes a server side event connection based on the user's session status.
   * @return An observable that emits the user's account if they are (still) logged in, otherwise null.
   */
  refreshSessionStatus(): Observable<Account> {
    this._loading = true;
    return this._httpClient.get<Account>(this.url).pipe(
      map((account: Account) => {
        (account)
          ? this._handleLoginSuccess(account, true)
          : this.logout(true);
        return this.account;
      }),
      finalize(() => this._loading = false)
    );
  }

  /**
   * Logs the user out and implicitly closes any server side event connection.
   * @param isSessionRefresh Set to true if the logout is from a session refresh operation. Default is false.
   */
  logout(isSessionRefresh = false): void {
    (isSessionRefresh)
      ? (this.loggedIn)
        ? this._alertService.displaySimpleMessage('You have been logged out due to inactivity', 'warn')
        : ''
      : this._alertService.displaySimpleMessage('Logout successful', 'success');
    this._serverSideEventService.close();
    this.account = null;
    this._httpClient.delete<void>(this.url).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    ).subscribe();
  }
}
