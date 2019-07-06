import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { SessionService } from '../../services/session/session.service';
import { PasswordResetService } from '../../services/password-reset/password-reset.service';

@Component({
  selector: 'food-web-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'Login';
  loginForm: FormGroup;
  isPasswordReset = false;
  resetMessageSent = false;
  usernamePlaceholder = 'Username/Email';

  constructor(
    public sessionService: SessionService,
    private _passwordResetService: PasswordResetService,
    private _formBuilder: FormBuilder,
    private _matDialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      usernameEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  public static openIfNotLoggedIn(sessionService: SessionService, matDialog: MatDialog): Observable<boolean> {
    return (!sessionService.loggedIn)
      ? matDialog.open(LoginComponent).afterClosed()
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
    const usernameEmail: string = this.loginForm.get('usernameEmail').value;
    const password: string = this.loginForm.get('password').value;
    this.sessionService.login(usernameEmail, password).subscribe(
      () => this._matDialogRef.close(true)
    );
  }

  forgotPassword(): void {
    this.title = 'Reset Password';
    this.usernamePlaceholder = 'Username';
    this.loginForm.reset();
    this.loginForm.get('password').disable();
    this.isPasswordReset = true;
  }

  returnToLogin(): void {
    this.title = 'Login';
    this.usernamePlaceholder = 'Username/Email';
    this.loginForm.get('password').enable();
    this.isPasswordReset = false;
  }

  sendPasswordResetEmail(): void {
    const username: string = this.loginForm.get('usernameEmail').value;
    this._passwordResetService.sendPasswordResetEmail(username).subscribe(
      () => this.resetMessageSent = true
    );
  }

}
