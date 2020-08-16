import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { AccountHelper, ImpersonateRequest, LoginRequest, LoginResponse } from '~shared';
import { environment } from '~web/../environments/environment';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { Account, SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  readonly url = `${environment.server}/session`;

  protected _loading = false;
  protected _login$ = new Subject<Account>();
  protected _logout$ = new Subject<Account>();

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertQueueService: AlertQueueService,
    protected _httpClient: HttpClient,
    protected _sessionService: SessionService
  ) {}

  /**
   * Whether or not the service is performing a 'loading' operation on the server.
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Whether or not the user is authenticated.
   */
  get loggedIn(): boolean {
    return !!this._sessionService.account;
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
    this._sessionService.saveAccount(response.account);
    if (notifyUser) {
      this._alertQueueService.add(`Welcome, ${this._accountHelper.accountName(response.account)}`, 'success');
    }
    this._login$.next(response.account);
    return response.account;
  }

  /**
   * Impersonates a user by logging in as a user that has been granted a given one-time use impersonation token.
   * @param usernameEmail The username/email of the user that has been granted the impersonation token (not the target impersonated user).
   * @param password The password of the user that has been granted the impersonation token (not the target impersonated user).
   * @param impersonationToken The granted impersonation token belonging to the current user.
   * @return An observable that emits the impersonation target account on success, and throws an error on failure.
   */
  impersonationLogin(usernameEmail: string, password: string, impersonationToken: string): Observable<Account> {
    const impersonateRequest: ImpersonateRequest = {
      impersonatorUsernameEmail: usernameEmail,
      impersonatorPassword: password,
      impersonationToken
    };
    this._loading = true;
    return this._httpClient.post<LoginResponse>(`${this.url}/impersonate`, impersonateRequest, { withCredentials: true }).pipe(
      map((response: LoginResponse) =>
        this._handleLoginSuccess(response, true)
      ),
      finalize(() => this._loading = false)
    );
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
    return this.checkIfUserLoggedIn().pipe(
      mergeMap((response: LoginResponse) =>
        this._handleSessionRefreshResponse(response)
      )
    );
  }

  /**
   * Checks if the user is logged in on the server (server session state may not match client session state).
   * @return An observable that emits the login response from the server login check.
   */
  checkIfUserLoggedIn(): Observable<LoginResponse> {
    this._loading = true;
    return this._httpClient.get<LoginResponse>(this.url, { withCredentials: true }).pipe(
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
    if (this._sessionService.account) {
      this.logout();
      this._alertQueueService.add('You have been logged out due to inactivity', 'warn');
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
        this._alertQueueService.add(err)
      )
    ).subscribe();

    const account: Account = this._sessionService.account;
    this._sessionService.deleteAccount();
    if (notifyUser) {
      this._alertQueueService.add('Logout successful', 'success');
    }
    this._logout$.next(account);
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
