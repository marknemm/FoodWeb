import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { LoginComponent } from '~hybrid/bootstrap/components/login/login.component';
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
 * A `perpetualSessionToken` is used to keep a mobile app logged in even after
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
    private _modalController: ModalController,
    private _router: Router,
  ) {
    super(_accountHelper, _alertService, _httpClient, _sessionService, null);
  }

  /**
   * Attempts to log the user in.
   * @param usernameEmail The username or email of the user.
   * @param password The password of the user.
   * @param notifyUser Whether or not to display a login success notification to the user upon successful login. Defaults to false.
   * @return An observable that emits the user's account when login is successful, and throws error on failure.
   */
  login(usernameEmail: string, password: string, notifyUser = false): Observable<Account> {
    const loginRequest: LoginRequest = { usernameEmail, password };
    return this._mobileDeviceService.mobileDevice$.pipe(
      switchMap((mobileDevice: MobileDevice) => {
        loginRequest.mobileDevice = mobileDevice;
        return super._sendLoginRequest(loginRequest);
      }),
      map((response: LoginResponse) =>
        this._handleLoginSuccess(response, notifyUser)
      )
    );
  }

  /**
   * Handles the successful login of a user.
   * @param response The login response.
   * @param notifyUser Whether or not to display a login success notification to the user upon successful login. Defaults to false.
   * @return The logged in user's account.
   */
  protected _handleLoginSuccess(response: LoginResponse, notifyUser = false): Account {
    const account: Account = super._handleLoginSuccess(response);
    this._sessionService.savePerpetualSession(response.perpetualSession);
    if (notifyUser) {
      this._alertService.displayMessage(`Welcome, ${this._accountHelper.accountName(response.account)}`, 'success');
    }
    return account;
  }

  /**
   * Checks if the user is logged in on the server (server session state may not match client session state).
   * @return An observable that emits the login response from the server login check.
   */
  checkIfUserLoggedIn(): Observable<LoginResponse> {
    return this._sessionService.loadLocalSession().pipe(
      switchMap(() => this._mobileDeviceService.mobileDevice$),
      switchMap(() => {
        // Connected to network, so check server for session status (best source of truth).
        if (this._mobileDeviceService.connected) {
          this._loading = true;
          const params = new HttpParams({
            fromObject: {
              perpetualSessionToken: this._sessionService.perpetualSession?.sessionToken,
              uuid: this._mobileDeviceService.mobileDevice.uuid
            }
          });
          return this._httpClient.get<LoginResponse>(this.url, { withCredentials: true, params }).pipe(
            finalize(() => this._loading = false)
          );
        }

        // Not connected to network, so solely rely on local session status for now.
        return of({
          account: this._sessionService.account,
          perpetualSession: this._sessionService.perpetualSession
        });
      })
    );
  }

  /**
   * Opens a login dialog if the user is not currently logged in.
   * @param disableClose Whether or not to disable closing of the dialog by clicking on the backdrop. Defaults to false.
   * @return An observable that emits the session account on dialog close if the login was successful,
   * or immediately if the user was already logged in. Returns null/undefined if the user was not logged in
   * and the dialog closes without successful login.
   */
  openLoginDialogIfNotLoggedIn(disableClose = false): Observable<Account> {
    return (!this._sessionService.loggedIn)
      ? this.openLoginDialog(disableClose)
      : of(this._sessionService.account);
  }

  /**
   * Opens a login dialog.
   * @param disableClose Whether or not to disable closing of the dialog by clicking on the backdrop. Defaults to false.
   * @return An observable that emits the session account on dialog close if the login was successful, null/undefined otherwise.
   */
  openLoginDialog(disableClose = false): Observable<Account> {
    return from(
      this._modalController.create({
        component: LoginComponent,
        backdropDismiss: !disableClose,
        swipeToClose: !disableClose,
        componentProps: { insideDialog: true }
      }).then((modal: HTMLIonModalElement) => modal.present())
    ).pipe(
      map(() => this._sessionService.account)
    );
  }

  /**
   * Logs the user out and returns the user to the login page.
   */
  logout(): void {
    super.logout();
    setTimeout(() => this._router.navigate(['/', 'bootstrap', 'login']));
  }
}
