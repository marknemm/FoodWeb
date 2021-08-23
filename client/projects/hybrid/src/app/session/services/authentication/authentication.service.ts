import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';
import { Account, AccountHelper, LoginRequest, LoginResponse, MobileDevice } from '~shared';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { AuthenticationService as WebAuthenticationService } from '~web/session/services/authentication/authentication.service';

/**
 * The hybrid app extension of the base web AuthenticationService,
 * which factors a never expiring `perpetualSessionToken` into the authentication
 * process for mobile apps.
 *
 * An `perpetualSessionToken` is used to keep a mobile app logged in even after
 * its web-based session expires.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends WebAuthenticationService {

  constructor(
    protected _accountHelper: AccountHelper,
    protected _alertService: AlertService,
    protected _httpClient: HttpClient,
    protected _sessionService: SessionService,
    private _mobileDeviceService: MobileDeviceService,
    private _router: Router
  ) {
    super(_accountHelper, _alertService, _httpClient, _sessionService);
  }

  /**
   * Attempts to log the user in.
   * @param usernameEmail The username or email of the user.
   * @param password The passwsord of the user.
   * @param goHomeOnSuccess Whether or not to goto the home page on login success. Defaults to false.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(usernameEmail: string, password: string, goHomeOnSuccess = false): Observable<Account> {
    const loginRequest: LoginRequest = { usernameEmail, password };
    return this._mobileDeviceService.getMobileDevice().pipe(
      switchMap((mobileDevice: MobileDevice) => {
        loginRequest.mobileDevice = mobileDevice;
        return super._sendLoginRequest(loginRequest);
      }),
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
    this._sessionService.savePerpetualSession(response.perpetualSession);
    if (goHomeOnSuccess) {
      this._router.navigate(['/', 'home']);
    }
    return account;
  }

  /**
   * Checks if the user is logged in on the server (server session state may not match client session state).
   * @return An observable that emits the login response from the server login check.
   */
  checkIfUserLoggedIn(): Observable<LoginResponse> {
    this._loading = true;
    const params = new HttpParams({
      fromObject: { perpetualSessionToken: this._sessionService.perpetualSession?.sessionToken }
    });
    return this._httpClient.get<LoginResponse>(this.url, { withCredentials: true, params }).pipe(
      finalize(() => this._loading = false)
    );
  }

  /**
   * Attempts to re-establish a session on the server and synchronize the client session with it via perpetual session token.
   * @param perpetualSession The app's long-lived (perpetual) session.
   * @return An observable that emits the session account data returned from the server. On failure, null is emitted.
   */
  // private _perpetualSessionLogin(perpetualSession: PerpetualSession): Observable<Account> {
  //   const loginRequest: AppTokenLoginRequest = { perpetualSession };
  //   return this._httpClient.post<LoginResponse>(`${this.url}/session-token`, loginRequest, { withCredentials: true }).pipe(
  //     map((response: LoginResponse) =>
  //       this._handleLoginSuccess(response)
  //     ),
  //     catchError((err: HttpErrorResponse) => {
  //       console.error(err);
  //       return of(null);
  //     })
  //   );
  // }

  /**
   * Logs the user out and returns the user to the login page.
   */
  logout(): void {
    this._router.navigate(['/login']);
    super.logout();
    this._sessionService.deletePerpetualSession();
  }
}
