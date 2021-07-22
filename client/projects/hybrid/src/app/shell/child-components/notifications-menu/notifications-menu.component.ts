import { Component, Input, OnInit } from '@angular/core';
import { cog, notifications } from 'ionicons/icons';
import { PopoverService } from '~hybrid/shared/services/popover/popover.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'foodweb-hybrid-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit {

  readonly cog = cog;
  readonly notifications = notifications;

  @Input()
  isMenu = false;

  constructor(
    public notificationService: NotificationService,
    public popoverService: PopoverService
  ) {}

  ngOnInit() {}

  showMenu(event: Event): void {
    this.notificationService.updateSeenNotifications();
    this.popoverService.showMenu(NotificationsMenuComponent, event, { cssClass: 'full-width' });
  }
}
