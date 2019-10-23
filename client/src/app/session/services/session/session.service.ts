import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { map, catchError, finalize, mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';
import { LoginRequest } from '../../../../../../shared/src/interfaces/session/login-request';
import { LoginResponse } from '../../../../../../shared/src/interfaces/session/login-response';
import { AppTokenLoginRequest } from '../../../../../../shared/src/interfaces/session/app-token-login-request';
import { AccountHelper, Account } from '../../../../../../shared/src/helpers/account-helper';
export { Account };

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  readonly url = `${environment.server}/session`;

  private _account: Account;
  private _loading = false;
  private _login$ = new Subject<Account>();
  private _logout$ = new Subject<void>();

  constructor(
    private _httpClient: HttpClient,
    private _router: Router,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService,
    private _accountHelper: AccountHelper,
    private _deviceInfoService: DeviceInfoService
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
    this._account = account;
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
      this._login$.next(account);
    } else {
      localStorage.removeItem('account');
      this._logout$.next();
    }
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
  get logout$(): Observable<void> {
    return this._logout$.asObservable();
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
   * @param usernameEmail The username or email of the user.
   * @param password The passwsord of the user.
   * @param silent Whether or not the login operation should be done silently.
   * A silent login operation will not display a message on success or redirect the user to any other page.
   * Default value is false.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(usernameEmail: string, password: string, silent = false): Observable<Account> {
    const loginRequest: LoginRequest = { usernameEmail, password, isApp: this._deviceInfoService.isMobileApp };
    this._loading = true;
    return this._httpClient.post<LoginResponse>(this.url, loginRequest).pipe(
      map((response: LoginResponse) => this._handleLoginSuccess(response, silent)),
      finalize(() => this._loading = false)
    );
  }

  /**
   * Handles the successful login of a user by setting up session data in the browser and opening a server side event client connection.
   * @param response The login response.
   * @param silent Set to true if the login success handler should silently record the user session on the client.
   * In silent mode, it will not display a login message or redirect a phone app to the home page.
   * @return The logged in user's account.
   */
  private _handleLoginSuccess(response: LoginResponse, silent: boolean): Account {
    this.account = response.account;
    if (this._deviceInfoService.isMobileApp) {
      localStorage.setItem('appSessionToken', response.appSessionToken);
      if (!silent) {
        this._router.navigate(['/home']);
      }
    }
    if (!silent) {
      this._alertService.displaySimpleMessage(`Welcome, ${this._accountHelper.accountName(response.account)}`, 'success');
    }
    this._login$.next(response.account);
    return response.account;
  }

  /**
   * Refreshes the session status so that it is in-sync with the user's session status on the server.
   * Implicitly opens/closes a server side event connection based on the user's session status.
   * @return An observable that emits the user's account if they are (still) logged in, otherwise null.
   */
  refreshSessionStatus(): Observable<Account> {
    this._loading = true;
    const params = new HttpParams().append('isApp', `${this._deviceInfoService.isMobileApp}`);
    return this._httpClient.get<LoginResponse>(this.url, { params }).pipe(
      mergeMap((response: LoginResponse) => {
        // Sync client session with existing session on server.
        if (response.account) {
          return of(this._handleLoginSuccess(response, true));
        }
        // Attempt to re-establish session via mobile app session token.
        const appSessionToken: string = localStorage.getItem('appSessionToken');
        if (this._deviceInfoService.isMobileApp && appSessionToken) {
          return this._appTokenLogin(appSessionToken);
        }
        // Logout to sync client session with lost session on server.
        this.logout(true);
        return of(null);
      }),
      finalize(() => this._loading = false)
    );
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
      map((response: LoginResponse) => this._handleLoginSuccess(response, true)),
      catchError((err: HttpErrorResponse) => {
        console.error(err);
        return of(null);
      })
    );
  }

  /**
   * Logs the user out and implicitly closes any server side event connection.
   * @param isSessionRefresh Set to true if the logout is from a session refresh operation. Default is false.
   */
  logout(isSessionRefresh = false): void {
    // NOTE: Important that mobile app navigation to login happens first to not show change in app header before navigation!
    (this._deviceInfoService.isMobileApp)
      ? this._router.navigate(['/mobile-boot/login'])
      : this._displayLogoutAlert(isSessionRefresh);
    this.account = null;
    const params = new HttpParams().append('isApp', `${this._deviceInfoService.isMobileApp}`);
    this._httpClient.delete<void>(this.url, { params }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    ).subscribe();
    this._logout$.next();    
  }

  private _displayLogoutAlert(isSessionRefresh: boolean): void {
    if (isSessionRefresh && this.loggedIn) {
      this._alertService.displaySimpleMessage('You have been logged out due to inactivity', 'warn');
    } else if (!isSessionRefresh) {
      this._alertService.displaySimpleMessage('Logout successful', 'success');
    }
  }
}
