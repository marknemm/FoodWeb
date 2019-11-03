import { Component, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { LoginFormChange } from '../login/login.component';
import { SessionService } from '../../services/session/session.service';
import { AppDataService } from '../../../mobile/services/app-data/app-data.service';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'food-web-login-dialog',
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

  ngOnInit() {
    this.loginFormChanged(LoginFormChange.Login);
  }

  public static openIfNotLoggedIn(sessionService: SessionService, matDialog: MatDialog, config: MatDialogConfig = {}): Observable<boolean> {
    const device = new Device();
    const isMobileApp: boolean = (!device.platform || device.platform === 'Browser');
    config.panelClass = (config.panelClass)
      ? (typeof config.panelClass === 'string')
        ? [config.panelClass]
        : config.panelClass
      : [];
    if (isMobileApp) {
      config.panelClass.push('full-screen-mobile');
    }
    config.autoFocus = !isMobileApp;
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
