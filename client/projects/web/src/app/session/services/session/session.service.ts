import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { Account, AccountHelper, LoginRequest, LoginResponse } from '~shared';
import { environment } from '~web/environments/environment';
import { AlertService } from '~web/shared/alert/alert.service';
import { ErrorHandlerService } from '~web/shared/error-handler/error-handler.service';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly url = `${environment.server}/session`;

  protected _account: Account;
  protected _accountName = '';
  protected _loading = false;
  protected _login$ = new Subject<Account>();
  protected _logout$ = new Subject<Account>();

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertService: AlertService,
    protected _errorHandlerService: ErrorHandlerService,
    protected _httpClient: HttpClient
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
    const oldAccount: Account = this._account;
    this._account = account;
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
      this._accountName = this._accountHelper.accountName(account);
      this._login$.next(account);
    } else {
      localStorage.removeItem('account');
      this._accountName = '';
      this._logout$.next(oldAccount);
    }
  }

  /**
   * The name of the user account.
   */
  get accountName(): string {
    return this._accountName;
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
   * An observalbe that emits the newly logged in user's account upon login.
   */
  get login$(): Observable<Account> {
    return this._login$.asObservable();
  }

  /**
   * An observable that emits void whenever logout occurs.
   */
  get logout$(): Observable<Account> {
    return this._logout$.asObservable();
  }

  /**
   * Checks if an account is owned by the current user.
   * @param accountId The ID of the account to check.
   * @return true if the account is owned by the current user, false if not.
   */
  hasAccountOwnership(accountId: number): boolean {
    return this._accountHelper.doesAccountIdMatch(this.account, accountId);
  }

  /**
   * Attempts to log the user in.
   * @param usernameEmail The username or email of the user.
   * @param password The passwsord of the user.
   * @param notifyUser Whether or not to display a login success notification to the user upon successful login. Defaults to false.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(usernameEmail: string, password: string, notifyUser = false): Observable<Account> {
    const loginRequest: LoginRequest = { usernameEmail, password };
    return this._sendLoginRequest(loginRequest).pipe(
      map((response: LoginResponse) =>
        this._handleLoginSuccess(response, notifyUser)
      )
    );
  }

  /**
   * Sends the login request to the server.
   * @param loginRequest The login request to send to the server.
   * @return An observable that emits the login response on success, and throws an error on failure.
   */
  protected _sendLoginRequest(loginRequest: LoginRequest): Observable<LoginResponse> {
    this._loading = true;
    return this._httpClient.post<LoginResponse>(this.url, loginRequest, { withCredentials: true }).pipe(
      finalize(() => this._loading = false)
    );
  }

  /**
   * Handles the successful login of a user.
   * @param response The login response.
   * @param notifyUser Whether or not to display a login success notification to the user upon successful login. Defaults to false.
   * @return The logged in user's account.
   */
  protected _handleLoginSuccess(response: LoginResponse, notifyUser = false): Account {
    this.account = response.account;
    if (notifyUser) {
      this._alertService.displaySimpleMessage(`Welcome, ${this._accountHelper.accountName(response.account)}`, 'success');
    }
    return response.account;
  }

  /**
   * Gets a login observable.
   * @param destroy$ An observable which when emitted, destroys the login subscription for the return observable.
   * @return The login observable.
   */
  onLogin(destroy$: Observable<any>): Observable<Account> {
    return this._login$.pipe(
      takeUntil(destroy$)
    );
  }

  /**
   * Refreshes the session status so that it is in-sync with the user's session status on the server.
   * Implicitly opens/closes a server side event connection based on the user's session status.
   * @return An observable that emits the user's account if they are (still) logged in, otherwise null.
   */
  refreshSessionStatus(): Observable<Account> {
    this._loading = true;
    return this._httpClient.get<LoginResponse>(this.url, { withCredentials: true }).pipe(
      mergeMap((response: LoginResponse) =>
        this._handleSessionRefreshResponse(response)
      ),
      finalize(() => this._loading = false)
    );
  }

  /**
   * Handles a session refresh response.
   * @param response The session refresh (login) response.
   * @return An observable that resolves to the account after syncing the session state with the server.
   * If the user has been logged out on the server, then it emits null.
   */
  protected _handleSessionRefreshResponse(response: LoginResponse): Observable<Account> {
    // Sync client session with existing session on server.
    return (response.account)
      ? of(this._handleLoginSuccess(response))
      : of(this._sessionRefreshLogout());
  }

  /**
   * Logs the user out as a result of a session refresh (sync with server logged out state),
   * and alerts them of the logout.
   * @return null, repressenting the new value for the client account session.
   */
  protected _sessionRefreshLogout(): null {
    if (this.account) {
      this.logout();
      this._alertService.displaySimpleMessage('You have been logged out due to inactivity', 'warn');
    }
    return null;
  }

  /**
   * Logs the user out and alerts them of a successful logout.
   * @param notifyUser Whether or not to notify the user of the successful logout via snackbar notification. Defaults to false.
   */
  logout(notifyUser = false): void {
    this._httpClient.delete<void>(this.url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) =>
        this._errorHandlerService.handleError(err)
      )
    ).subscribe();
    this.account = null;
    if (notifyUser) {
      this._alertService.displaySimpleMessage('Logout successful', 'success');
    }
  }

  /**
   * Gets a logout observable.
   * @param destroy$ An observable which when emitted, destroys the logout subscription for the return observable.
   * @return The logout observable.
   */
  onLogout(destroy$: Observable<any>): Observable<Account> {
    return this._logout$.pipe(
      takeUntil(destroy$)
    );
  }
}
