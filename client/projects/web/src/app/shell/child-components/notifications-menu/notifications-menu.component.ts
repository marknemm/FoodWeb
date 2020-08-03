import { Component, OnInit } from '@angular/core';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'foodweb-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit {

  readonly faCog = faCog;

  constructor(
    public notificationService: NotificationService
  ) {}

  ngOnInit() {}
}
