import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { LoginFormChange } from '../login/login.component';
import { SessionService } from '../../services/session/session.service';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';

@Component({
  selector: 'food-web-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  private _title: string;

  constructor(
    public sessionService: SessionService,
    public deviceInfoService: DeviceInfoService,
    @Optional() public matDialogRef: MatDialogRef<LoginDialogComponent>,
  ) {}

  get title(): string {
    return this._title;
  }

  ngOnInit() {
    this.loginFormChanged(LoginFormChange.Login);
  }

  public static openIfNotLoggedIn(sessionService: SessionService, matDialog: MatDialog, config: MatDialogConfig = {}): Observable<boolean> {
    const deviceInfoService = new DeviceInfoService();
    config.panelClass = (config.panelClass)
      ? (typeof config.panelClass === 'string')
        ? [config.panelClass]
        : config.panelClass
      : [];
    if (deviceInfoService.isMobileApp) {
      config.panelClass.push('full-screen-mobile');
    }
    config.autoFocus = !deviceInfoService.isMobileApp;
    config.maxWidth = '400px';
    return (!sessionService.loggedIn)
      ? matDialog.open(LoginDialogComponent, config).afterClosed()
      : of(true);
  }

  loginFormChanged(change: LoginFormChange): void {
    switch (change) {
      case LoginFormChange.Login:             this._title = 'Login';            break;
      case LoginFormChange.UsernameRecovery:  this._title = 'Recover Username'; break;
      case LoginFormChange.PasswordReset:     this._title = 'Reset Password';   break;
    }
  }
}
