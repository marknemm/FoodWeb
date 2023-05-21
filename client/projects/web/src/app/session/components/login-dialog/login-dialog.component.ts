import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginFormMode } from '~web/session/services/login-form-adapter/login-form-adapter.service';

@Component({
  selector: 'foodweb-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  private _title = '';

  constructor(
    @Optional() public dialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  get title(): string {
    return this._title;
  }

  ngOnInit(): void {
    this.formModeChanged(LoginFormMode.Login);
  }

  formModeChanged(formMode: LoginFormMode): void {
    switch (formMode) {
      case LoginFormMode.Login:             this._title = 'Login';            break;
      case LoginFormMode.UsernameRecovery:  this._title = 'Recover Username'; break;
      case LoginFormMode.PasswordReset:     this._title = 'Reset Password';   break;
    }
  }
}
