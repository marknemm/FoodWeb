import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NEVER, Observable, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Account } from '~shared';
import { UsernameRecoveryService } from '~web/account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '~web/password/services/password-reset/password-reset.service';
import { LoginForm } from '~web/session/forms/login.form';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';

@Component({
  selector: 'foodweb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() insideDialog = false;

  @Output() formChanged = new EventEmitter<LoginFormChange>();
  @Output() loggedIn = new EventEmitter<void>();

  readonly loginForm = new LoginForm();

  protected _impersonationToken = '';
  protected _isPasswordReset = false;
  protected _isUsernameRecovery = false;
  protected _loginErr = '';
  protected _recoveryMessageSent = false;
  protected _resetMessageSent = false;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _authService: AuthenticationService,
    protected _passwordResetService: PasswordResetService,
    protected _usernameRecoveryService: UsernameRecoveryService
  ) {}

  get isLogin(): boolean {
    return (!this.isUsernameRecovery && !this.isPasswordReset);
  }

  get isPasswordReset(): boolean {
    return this._isPasswordReset;
  }

  get isUsernameRecovery(): boolean {
    return this._isUsernameRecovery;
  }

  get loading(): boolean {
    return (this._authService.loading || this._usernameRecoveryService.loading || this._passwordResetService.loading);
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

  get usernameEmailPlaceholder(): string {
    return (this.isUsernameRecovery)
      ? 'Email'
      : 'Username / Email';
  }

  ngOnInit() {
    this._impersonationToken = (this._activatedRoute.snapshot.queryParamMap.has('impersonationToken'))
      ? this._activatedRoute.snapshot.queryParamMap.get('impersonationToken') : '';
  }

  submit(): void {
    if (this.loginForm.valid) {
      (this.isPasswordReset)
        ? this.sendPasswordResetEmail()
        : (this.isUsernameRecovery)
          ? this.sendUsernameRecoveryEmail()
          : this.login();
    }
  }

  login(): void {
    const username: string = this.loginForm.get('usernameEmail').value;
    const password: string = this.loginForm.get('password').value;
    const loginResponse$: Observable<Account> = (this._impersonationToken)
      ? this._authService.impersonationLogin(username, password, this._impersonationToken)
      : this._authService.login(username, password, true);
    this._authService['_loading'] = true;
    loginResponse$.pipe(catchError(this._handleLoginErr.bind(this)))
                  .subscribe(this._handleLoginSuccess.bind(this));
  }

  protected _handleLoginErr(err: HttpErrorResponse): ObservableInput<any> {
    this._loginErr = (err.error && err.error.message) ? err.error.message : err.message;
    console.log(this._loginErr);
    return NEVER;
  }

  protected _handleLoginSuccess(): void {
    this._loginErr = '';
    this.loggedIn.emit();
    // Navigation to homepage may be found in `AuthenticationService`.
  }

  forgotUsername(): void {
    this.loginForm.reset();
    this.loginForm.get('password').disable();
    this._isUsernameRecovery = true;
    this._loginErr = '';
    this.formChanged.emit(LoginFormChange.UsernameRecovery);
  }

  forgotPassword(): void {
    this.loginForm.reset({ usernameEmail: this.loginForm.value.usernameEmail });
    this.loginForm.get('password').disable();
    this._isPasswordReset = true;
    this._loginErr = '';
    this.formChanged.emit(LoginFormChange.PasswordReset);
  }

  returnToLogin(): void {
    this.loginForm.get('password').enable();
    this.loginForm.reset({ usernameEmail: this.loginForm.value.usernameEmail });
    this._isUsernameRecovery = false;
    this._recoveryMessageSent = false;
    this._isPasswordReset = false;
    this._resetMessageSent = false;
    this._loginErr = '';
    this.formChanged.emit(LoginFormChange.Login);
  }

  sendUsernameRecoveryEmail(): void {
    const email: string = this.loginForm.get('usernameEmail').value;
    this._usernameRecoveryService.sendUsernameRecoveryEmail(email).subscribe(
      () => this._recoveryMessageSent = true
    );
  }

  sendPasswordResetEmail(): void {
    const username: string = this.loginForm.get('usernameEmail').value;
    this._passwordResetService.sendPasswordResetEmail(username).subscribe(
      () => this._resetMessageSent = true
    );
  }
}

export enum LoginFormChange { Login, UsernameRecovery, PasswordReset }
