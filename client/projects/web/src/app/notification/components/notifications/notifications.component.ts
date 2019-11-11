import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notification, ListResponse } from '~shared';

import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'food-web-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input() notificationsMenu = false;

  private _notifications: Notification[] = [];
  private _totalCount = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService
  ) {}

  get notifications(): Notification[] {
    return this._notifications;
  }

  get totalCount(): number  {
    return this._totalCount;
  }

  ngOnInit() {
    // Only listen for query parameter changes if we are on notifications page (not a menu off of header).
    if (!this.notificationsMenu) {
      this._notificationService.listenNotificationsQueryChange(this._activatedRoute).subscribe((response: ListResponse<Notification>) => {
        this._notifications = response.list;
        this._totalCount = response.totalCount;
      });
    }
  }

}
