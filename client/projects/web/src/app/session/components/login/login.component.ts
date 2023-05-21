import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { LoginForm, LoginFormAdapter, LoginFormMode } from '~web/session/services/login-form-adapter/login-form-adapter.service';
import { LoginSubmitService } from '~web/session/services/login-submit/login-submit.service';

@Component({
  selector: 'foodweb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginSubmitService]
})
export class LoginComponent implements OnDestroy {

  readonly loginForm: LoginForm = this._loginFormAdapter.toForm();

  private _formMode = LoginFormMode.Login;
  private _destroy$ = new Subject<void>();

  @Input() dialogRef: MatDialogRef<LoginDialogComponent> = null;

  @Output() formModeChanged = new EventEmitter<LoginFormMode>();
  @Output() loggedIn = new EventEmitter<void>();

  constructor(
    private _loginFormAdapter: LoginFormAdapter,
    private _loginSubmitService: LoginSubmitService,
  ) {
    this._loginSubmitService.loggedIn$.pipe(
      takeUntil(this._destroy$)
    ).subscribe(() => this.loggedIn.emit());
  }

  get loginErr(): string {
    return this._loginSubmitService.loginErr;
  }

  get formMode(): LoginFormMode {
    return this._formMode;
  }

  get loading(): boolean {
    return this._loginSubmitService.loading;
  }

  get messageSent(): boolean {
    return this._loginSubmitService.messageSent;
  }

  get isLogin(): boolean {
    return (this.formMode === LoginFormMode.Login);
  }

  get isPasswordReset(): boolean {
    return (this.formMode === LoginFormMode.PasswordReset);
  }

  get isUsernameRecovery(): boolean {
    return (this.formMode === LoginFormMode.UsernameRecovery);
  }

  get recoveryMessageSent(): boolean {
    return this._loginSubmitService.recoveryMessageSent;
  }

  get resetMessageSent(): boolean {
    return this._loginSubmitService.resetMessageSent;
  }

  get usernameEmailPlaceholder(): string {
    return this.isUsernameRecovery
      ? 'Email'
      : 'Username / Email';
  }

  submit(): void {
    if (this.loginForm.valid) {
      this._loginSubmitService.submit(this.loginForm.value.usernameEmail, this.loginForm.value.password, this.formMode);
    }
  }

  toLogin(): void {
    this._toFormMode(LoginFormMode.Login);
  }

  toPasswordReset(): void {
    this._toFormMode(LoginFormMode.PasswordReset);
  }

  toUsernameRecovery(): void {
    this._toFormMode(LoginFormMode.UsernameRecovery);
  }

  private _toFormMode(mode: LoginFormMode): void {
    this._loginFormAdapter.toMode(this.loginForm, mode);
    this._formMode = mode;
    this.formModeChanged.emit(this.formMode);
  }

  ngOnDestroy(): void {

  }

}
