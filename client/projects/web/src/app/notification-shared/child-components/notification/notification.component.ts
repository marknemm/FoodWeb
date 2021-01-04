import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '~shared';
import { Convert } from '~web/component-decorators';
import { NotificationService } from '~web/notification/services/notification/notification.service';

@Component({
  selector: 'foodweb-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() notification: Notification;
  @Convert()
  @Input() max2Lines: boolean = false;

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
