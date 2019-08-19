import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { Notification } from '../../../../../shared/src/interfaces/notification/notification';

@Component({
  selector: 'food-web-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() notification: Notification;

  constructor(
    private _router: Router,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {}

  handleNotificationClick(): void {
    this._notificationService.updateNotificationReadState(this.notification, true);
    if (this.notification.notificationLink) {
      this._router.navigateByUrl(this.notification.notificationLink);
    }
  }

  handleFlaggedIndicatorClick(event: MouseEvent): void {
    event.stopPropagation();
    this._notificationService.updateNotificationFlaggedState(this.notification, !this.notification.flagged);
  }

  shouldFadeBottom(elem: HTMLElement): boolean {
    return (elem.scrollHeight > elem.clientHeight);
  }

}
