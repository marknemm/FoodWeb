import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {}

  login(): void {
    LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);
  }

}
