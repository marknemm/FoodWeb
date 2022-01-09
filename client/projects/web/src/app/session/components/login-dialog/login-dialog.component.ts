import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginFormMode } from '~web/session/forms/login.form';

@Component({
  selector: 'foodweb-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  private _title: string;

  constructor(
    @Optional() public matDialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  get title(): string {
    return this._title;
  }

  ngOnInit() {
    this.loginFormChanged(LoginFormMode.Login);
  }

  loginFormChanged(change: LoginFormMode): void {
    switch (change) {
      case LoginFormMode.Login:             this._title = 'Login';            break;
      case LoginFormMode.UsernameRecovery:  this._title = 'Recover Username'; break;
      case LoginFormMode.PasswordReset:     this._title = 'Reset Password';   break;
    }
  }
}
