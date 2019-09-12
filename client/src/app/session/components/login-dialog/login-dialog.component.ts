import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, never, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from '../../services/session/session.service';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';
import { PasswordResetService } from '../../../password/services/password-reset/password-reset.service';

@Component({
  selector: 'food-web-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  loginForm: FormGroup;

  private _title = 'Login';
  private _loginErr = '';
  private _isPasswordReset = false;
  private _resetMessageSent = false;

  constructor(
    public sessionService: SessionService,
    public deviceInfoService: DeviceInfoService,
    public matDialogRef: MatDialogRef<LoginDialogComponent>,
    private _passwordResetService: PasswordResetService,
    private _formBuilder: FormBuilder,
  ) {}

  get title(): string {
    return this._title;
  }

  get loginErr(): string {
    return this._loginErr;
  }

  get isPasswordReset(): boolean {
    return this._isPasswordReset;
  }

  get resetMessageSent(): boolean {
    return this._resetMessageSent;
  }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public static openIfNotLoggedIn(sessionService: SessionService, matDialog: MatDialog, config: MatDialogConfig = {}): Observable<boolean> {
    const deviceInfoService = new DeviceInfoService();
    config.panelClass = (config.panelClass)
      ? (typeof config.panelClass === 'string')
        ? [config.panelClass]
        : config.panelClass
      : [];
    config.panelClass.push('full-screen-mobile');
    config.autoFocus = !deviceInfoService.isMobileApplication;
    return (!sessionService.loggedIn)
      ? matDialog.open(LoginDialogComponent, config).afterClosed()
      : of(true);
  }

  get loading(): boolean {
    return this.sessionService.loading || this._passwordResetService.loading;
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.isPasswordReset ? this.sendPasswordResetEmail() : this.login();
    }
  }

  login(): void {
    const username: string = this.loginForm.get('username').value;
    const password: string = this.loginForm.get('password').value;
    this.sessionService.login(username, password)
      .pipe(catchError(this._handleLoginErr.bind(this)))
      .subscribe(this._handleLoginSuccess.bind(this));
  }

  private _handleLoginErr(err: Error): ObservableInput<any> {
    console.error(err);
    this._loginErr = 'Incorrect username or password';
    return never;
  }

  private _handleLoginSuccess(): void {
    this._loginErr = '';
    this.matDialogRef.close(true);
  }

  forgotPassword(): void {
    this._title = 'Reset Password';
    this.loginForm.reset();
    this.loginForm.get('password').disable();
    this._isPasswordReset = true;
  }

  returnToLogin(): void {
    this._title = 'Login';
    this.loginForm.get('password').enable();
    this._isPasswordReset = false;
  }

  sendPasswordResetEmail(): void {
    const username: string = this.loginForm.get('username').value;
    this._passwordResetService.sendPasswordResetEmail(username).subscribe(
      () => this._resetMessageSent = true
    );
  }

}
