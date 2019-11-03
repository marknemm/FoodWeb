import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { Notification } from '../../../../../../shared/src/interfaces/notification/notification';

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
