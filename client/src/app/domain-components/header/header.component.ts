import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../components/login/login.component';
import { SessionService } from '../../services/session/session.service';
import { PageTitleService } from '../../services/page-title/page-title.service';
import { LeftNavService } from '../../services/left-nav/left-nav.service';
import { PageProgressService } from '../../services/page-progress/page-progress.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'food-web-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private _numNotifications = 0;

  constructor(
    public sessionService: SessionService,
    public pageTitleService: PageTitleService,
    public pageProgressService: PageProgressService,
    public leftNavService: LeftNavService,
    private _matDialog: MatDialog,
    private _notificationService: NotificationService
  ) {}

  get numNotifications(): number {
    return this._numNotifications;
  }

  ngOnInit() {
    this._notificationService.onNotificationsAvailable().subscribe(
      (numNotifications) => (this._numNotifications = numNotifications)
    );
  }

  login(): void {
    this._matDialog.open(LoginComponent);
  }

}
