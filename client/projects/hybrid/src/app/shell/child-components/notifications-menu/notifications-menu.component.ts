import { Component, Input, OnInit } from '@angular/core';
import { PopoverService } from '~hybrid/shared/services/popover/popover.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'foodweb-hybrid-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit {

  @Input()
  isMenu = false;

  constructor(
    public notificationService: NotificationService,
    private _popoverService: PopoverService
  ) {}

  ngOnInit() {}

  present(event: Event): void {
    this.notificationService.updateSeenNotifications();
    this._popoverService.present(NotificationsMenuComponent, event, { cssClass: 'full-width' });
  }

  dismiss(): void {
    this._popoverService.dismiss(NotificationsMenuComponent);
  }
}
