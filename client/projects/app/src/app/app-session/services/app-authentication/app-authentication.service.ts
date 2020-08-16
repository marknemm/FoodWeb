import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { Account, AccountHelper, AppTokenLoginRequest, LoginRequest, LoginResponse } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AppAuthenticationService extends AuthenticationService {

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertQueueService: AlertQueueService,
    protected _httpClient: HttpClient,
    protected _router: RouterExtensions,
    protected _sessionService: AppSessionService
  ) {
    super(_accountHelper, _alertQueueService, _httpClient, _sessionService);
  }

  /**
   * Attempts to log the user in.
   * @param usernameEmail The username or email of the user.
   * @param password The passwsord of the user.
   * @param goHomeOnSuccess Whether or not to goto the home page on login success. Defaults to false.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(usernameEmail: string, password: string, goHomeOnSuccess = false): Observable<Account> {
    const loginRequest: LoginRequest = { usernameEmail, password, isApp: true };
    return super._sendLoginRequest(loginRequest).pipe(
      map((response: LoginResponse) =>
        this._handleLoginSuccess(response, goHomeOnSuccess)
      )
    );
  }

  /**
   * Handles the successful login of a user.
   * @param response The login response.
   * @param goHomeOnSuccess Whether or not to goto the home page on login success. Defaults to false.
   * @return The logged in user's account.
   */
  protected _handleLoginSuccess(response: LoginResponse, goHomeOnSuccess = false): Account {
    const account: Account = super._handleLoginSuccess(response);
    this._sessionService.saveAppSessionToken(response.appSessionToken);
    if (goHomeOnSuccess) {
      this._router.navigate(['/home']);
    }
    return account;
  }

  /**
   * Handles a session refresh response.
   * @param response The session refresh (login) response.
   * @return An observable that resolves to the account after syncing the session state with the server.
   * If the user has been logged out on the server, then it emits null.
   */
  protected _handleSessionRefreshResponse(response: LoginResponse): Observable<Account> {
    if (response.account) {
      return of(this._handleLoginSuccess(response));
    }

    // Attempt to re-establish session via mobile app session token if logged out on server.
    if (this._sessionService.appSessionToken) {
      return this._appTokenLogin(this._sessionService.appSessionToken);
    }
    this.logout();
    return of(null);
  }

  /**
   * Attempts to re-establish a session on the server and synchronize the client session with it.
   * Will use a mobile app's long-lived session token for the task.
   * @param appSessionToken The mobile app's long-lived session token.
   * @return An observable that emits the session account data returned from the server. On failure, null is emitted.
   */
  private _appTokenLogin(appSessionToken: string): Observable<Account> {
    const loginRequest: AppTokenLoginRequest = { appSessionToken };
    return this._httpClient.post<LoginResponse>(`${this.url}/session-token`, loginRequest, { withCredentials: true }).pipe(
      map((response: LoginResponse) =>
        this._handleLoginSuccess(response)
      ),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        return of(null);
      })
    );
  }

  /**
   * Logs the user out and returns the user to the login page.
   */
  logout(): void {
    this._router.navigate(['/login']);
    super.logout();
    this._sessionService.deleteAppSessionToken();
  }
}
