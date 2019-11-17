import { Component, OnInit } from '@angular/core';

import { NotificationService } from '~web/notification/notification.service';

@Component({
  selector: 'food-web-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit {

  constructor(
    public notificationService: NotificationService
  ) {}

  ngOnInit() {}
}
