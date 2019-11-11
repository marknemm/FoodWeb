import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService, PageProgressService } from '~web/shared';

import { SessionService } from '~web/session/services/session/session.service';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { LeftNavService } from '~web/app-shell/services/left-nav/left-nav.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'food-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public pageTitleService: PageTitleService,
    public pageProgressService: PageProgressService,
    public leftNavService: LeftNavService,
    public notificationService: NotificationService,
    private _router: Router,
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {}

  login(): void {
    LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);
  }

}
