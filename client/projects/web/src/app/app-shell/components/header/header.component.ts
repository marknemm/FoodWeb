import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from '~web/page-title/page-title.service';
import { PageProgressService } from '~web/page-progress/page-progress.service';
import { SessionService } from '~web/session/session.service';
import { LoginDialogComponent } from '~web/login-dialog/login-dialog.component';
import { LeftNavService } from '~web/left-nav/left-nav.service';
import { NotificationService } from '~web/notification/notification.service';

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
    private _matDialog: MatDialog
  ) {}

  ngOnInit() {}

  login(): void {
    LoginDialogComponent.openIfNotLoggedIn(this.sessionService, this._matDialog);
  }
}
