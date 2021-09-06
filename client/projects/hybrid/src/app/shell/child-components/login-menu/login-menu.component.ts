import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { PopoverService } from '~hybrid/shared/services/popover/popover.service';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';

@Component({
  selector: 'foodweb-hybrid-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent implements OnInit {

  @Input()
  isMenu = false;

  constructor(
    private _matDialog: MatDialog,
    private _popoverService: PopoverService,
    private _sessionService: SessionService
  ) {}

  ngOnInit() {}

  showLoginDialog(): void {
    LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog);
  }

  present(event: Event): void {
    this._popoverService.present(LoginMenuComponent, event);
  }

  dismiss(): void {
    this._popoverService.dismiss(LoginMenuComponent);
  }

}
