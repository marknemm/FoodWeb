import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../../session/components/login-dialog/login-dialog.component';
import { SessionService } from '../../../session/services/session/session.service';
import { PageTitleService } from '../../../shared/services/page-title/page-title.service';
import { LeftNavService } from '../../services/left-nav/left-nav.service';
import { PageProgressService } from '../../../shared/services/page-progress/page-progress.service';
import { NotificationService } from '../../../notification/services/notification/notification.service';

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
