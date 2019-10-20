import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { never, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginForm } from '../../forms/login.form';
import { SessionService } from '../../services/session/session.service';
import { PasswordResetService } from '../../../password/services/password-reset/password-reset.service';

@Component({
  selector: 'food-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: LoginForm;

  private _title = 'Login';
  private _loginErr = '';
  private _isPasswordReset = false;
  private _resetMessageSent = false;

  constructor(
    public sessionService: SessionService,
    private _passwordResetService: PasswordResetService
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
    this.loginForm = new LoginForm();
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
  }

  forgotPassword(): void {
    this._title = 'Reset Password';
    this.loginForm.reset({ username: this.loginForm.value.username });
    this.loginForm.get('password').disable();
    this._isPasswordReset = true;
  }

  returnToLogin(): void {
    this._title = 'Login';
    this.loginForm.get('password').enable();
    this.loginForm.reset({ username: this.loginForm.value.username });
    this._isPasswordReset = false;
    this._resetMessageSent = false;
  }

  sendPasswordResetEmail(): void {
    const username: string = this.loginForm.get('username').value;
    this._passwordResetService.sendPasswordResetEmail(username).subscribe(
      () => this._resetMessageSent = true
    );
  }

}
