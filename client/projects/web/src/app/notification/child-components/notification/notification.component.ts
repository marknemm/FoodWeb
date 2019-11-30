import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '~shared';
import { NotificationService } from '~web/notification/notification/notification.service';

@Component({
  selector: 'food-web-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() notification: Notification;
  @Input() max2Lines = false;

  constructor(
    public notificationService: NotificationService
  ) {}

  ngOnInit() {}

  handleFlaggedIndicatorClick(event: MouseEvent): void {
    event.stopPropagation();
    this.notificationService.updateNotificationFlaggedState(this.notification, !this.notification.flagged);
  }

  shouldFadeBottom(elem: HTMLElement): boolean {
    return (this.max2Lines && elem.scrollHeight > elem.clientHeight);
  }

}
