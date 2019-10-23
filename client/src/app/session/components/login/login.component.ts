import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { never, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginForm } from '../../forms/login.form';
import { SessionService } from '../../services/session/session.service';
import { UsernameRecoveryService } from '../../../account/services/username-recovery/username-recovery.service';
import { PasswordResetService } from '../../../password/services/password-reset/password-reset.service';

@Component({
  selector: 'food-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() insideDialog = false;

  @Output() formChanged = new EventEmitter<LoginFormChange>();
  @Output() loggedIn = new EventEmitter<void>();

  loginForm: LoginForm;

  private _isUsernameRecovery = false;
  private _recoveryMessageSent = false;
  private _isPasswordReset = false;
  private _resetMessageSent = false;
  private _loginErr = '';

  constructor(
    public sessionService: SessionService,
    private _usernameRecoveryService: UsernameRecoveryService,
    private _passwordResetService: PasswordResetService
  ) {}

  get isLogin(): boolean {
    return (!this.isUsernameRecovery && !this.isPasswordReset);
  }

  get messageSent(): boolean {
    return (this.recoveryMessageSent || this.resetMessageSent);
  }

  get isUsernameRecovery(): boolean {
    return this._isUsernameRecovery;
  }

  get recoveryMessageSent(): boolean {
    return this._recoveryMessageSent;
  }

  get isPasswordReset(): boolean {
    return this._isPasswordReset;
  }

  get resetMessageSent(): boolean {
    return this._resetMessageSent;
  }

  get loginErr(): string {
    return this._loginErr;
  }

  get loading(): boolean {
    return (this.sessionService.loading || this._usernameRecoveryService.loading || this._passwordResetService.loading);
  }

  get usernameEmailPlaceholder(): string {
    return (this.isUsernameRecovery)
      ? 'Email'
      : 'Username / Email';
  }

  ngOnInit() {
    this.loginForm = new LoginForm();
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
    this.sessionService.login(username, password)
      .pipe(catchError(this._handleLoginErr.bind(this)))
      .subscribe(this._handleLoginSuccess.bind(this));
  }

  private _handleLoginErr(err: HttpErrorResponse): ObservableInput<any> {
    console.error(err);
    this._loginErr = (err.error && err.error.message) ? err.error.message : err.message;
    return never;
  }

  private _handleLoginSuccess(): void {
    this._loginErr = '';
    this.loggedIn.emit();
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
