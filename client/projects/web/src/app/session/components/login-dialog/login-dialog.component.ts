import { Component, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { LoginFormChange } from '~web/session/components/login/login.component';
import { Account, SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  private _title: string;

  constructor(
    public sessionService: SessionService,
    @Optional() public matDialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  get title(): string {
    return this._title;
  }

  /**
   * Opens a login dialog if the user is not currently logged in.
   * @param sessionService The session service used to determine if the user is logged in.
   * @param matDialog The material dialog service used for dialog initialization & display.
   * @param config The optional material dialog config.
   * @return An observable that emits the session account on dialog close if the login was successful,
   * or immediately if the user was already logged in. Returns null/undefined if the user was not logged in
   * and the dialog closes without successful login.
   */
  public static openIfNotLoggedIn(sessionService: SessionService, matDialog: MatDialog, config: MatDialogConfig = {}): Observable<Account> {
    return (!sessionService.loggedIn)
      ? LoginDialogComponent.open(matDialog, config)
      : of(sessionService.account);
  }

  /**
   * Opens a login dialog.
   * @param matDialog The material dialog service used for dialog initialization & display.
   * @param config The optional material dialog config.
   * @return An observable that emits the session account on dialog close if the login was sucessful, null/undefined otherwise.
   */
  public static open(matDialog: MatDialog, config: MatDialogConfig = {}): Observable<Account> {
    config.panelClass = (config.panelClass)
      ? (typeof config.panelClass === 'string')
        ? [config.panelClass]
        : config.panelClass
      : [];
    config.maxWidth = '400px';
    return matDialog.open(LoginDialogComponent, config).afterClosed();
  }

  ngOnInit() {
    this.loginFormChanged(LoginFormChange.Login);
  }

  loginFormChanged(change: LoginFormChange): void {
    switch (change) {
      case LoginFormChange.Login:             this._title = 'Login';            break;
      case LoginFormChange.UsernameRecovery:  this._title = 'Recover Username'; break;
      case LoginFormChange.PasswordReset:     this._title = 'Reset Password';   break;
    }
  }
}
