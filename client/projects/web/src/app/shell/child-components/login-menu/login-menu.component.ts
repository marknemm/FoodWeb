import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent implements OnInit {

  constructor(
    private _matDialog: MatDialog,
    private _sessionService: SessionService
  ) {}

  ngOnInit() {}

  showLoginDialog(): void {
    LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog);
  }

}
