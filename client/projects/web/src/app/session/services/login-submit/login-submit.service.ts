import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NEVER, Observable, ObservableInput, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Account } from '~shared';
import { UsernameRecoveryService } from '~web/account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';
import { LoginFormMode } from '~web/session/forms/login.form';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Injectable()
export class LoginSubmitService {

  private _loginErr = '';
  private _recoveryMessageSent = false;
  private _resetMessageSent = false;
  private _loggedIn$ = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthenticationService,
    private _passwordResetService: PasswordResetService,
    private _router: Router,
    private _usernameRecoveryService: UsernameRecoveryService,
  ) { }

  get loading(): boolean {
    return (this._authService.loading || this._usernameRecoveryService.loading || this._passwordResetService.loading);
  }

  get loggedIn$(): Observable<void> {
    return this._loggedIn$.asObservable();
  }

  get loginErr(): string {
    return this._loginErr;
  }

  get messageSent(): boolean {
    return (this.recoveryMessageSent || this.resetMessageSent);
  }

  get recoveryMessageSent(): boolean {
    return this._recoveryMessageSent;
  }

  get resetMessageSent(): boolean {
    return this._resetMessageSent;
  }

  reset(): void {
    this._loginErr = '';
    this._recoveryMessageSent = false;
    this._resetMessageSent = false;
  }

  submit(usernameEmail: string, password: string, mode: LoginFormMode): void {
    (mode === LoginFormMode.PasswordReset)
      ? this._sendPasswordResetEmail(usernameEmail)
      : (mode === LoginFormMode.UsernameRecovery)
        ? this._sendUsernameRecoveryEmail(usernameEmail)
        : this._login(usernameEmail, password);
  }

  private _getImpersonationToken(): string {
    return (this._activatedRoute.snapshot.queryParamMap.has('impersonationToken'))
      ? this._activatedRoute.snapshot.queryParamMap.get('impersonationToken')
      : '';
  }

  private _login(usernameEmail: string, password: string): void {
    const impersonationToken = this._getImpersonationToken();
    const loginResponse$: Observable<Account> = (impersonationToken)
      ? this._authService.impersonationLogin(usernameEmail, password, impersonationToken)
      : this._authService.login(usernameEmail, password, true);
    loginResponse$.pipe(catchError(this._handleLoginErr.bind(this)))
                  .subscribe(this._handleLoginSuccess.bind(this));
  }

  private _handleLoginErr(err: HttpErrorResponse): ObservableInput<any> {
    this._loginErr = (err.error && err.error.message) ? err.error.message : err.message;
    console.error(this._loginErr);
    return NEVER;
  }

  private _handleLoginSuccess(): void {
    this._loginErr = '';
    this._loggedIn$.next();
    if (this._router.url.indexOf('login') >= 0) { // Only navigate to home if on dedicated login page (not dialog).
      this._router.navigate(['/', 'home']);
    }
  }

  private _sendUsernameRecoveryEmail(usernameEmail: string): void {
    this._usernameRecoveryService.sendUsernameRecoveryEmail(usernameEmail).subscribe(
      () => this._recoveryMessageSent = true
    );
  }

  private _sendPasswordResetEmail(usernameEmail: string): void {
    this._passwordResetService.sendPasswordResetEmail(usernameEmail).subscribe(
      () => this._resetMessageSent = true
    );
  }
}
