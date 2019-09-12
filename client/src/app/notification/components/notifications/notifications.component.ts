import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { Notification } from '../../../../../../shared/src/interfaces/notification/notification';
import { ListResponse } from '../../../../../../shared/src/interfaces/list-response';

@Component({
  selector: 'food-web-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input() notificationsMenu = false;

  notifications: Notification[];
  totalCount = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Only listen for query parameter changes if we are on notifications page (not a menu off of header).
    if (!this.notificationsMenu) {
      this._notificationService.listenNotificationsQueryChange(this._activatedRoute).subscribe((response: ListResponse<Notification>) => {
        this.notifications = response.list;
        this.totalCount = response.totalCount;
      });
    }
  }

}
