import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'food-web-notifications-menu',
  templateUrl: './notifications-menu.component.html',
  styleUrls: ['./notifications-menu.component.scss'],
})
export class NotificationsMenuComponent implements OnInit {

  constructor(
    public notificationService: NotificationService,
    private _router: Router
  ) {}

  ngOnInit() {}

  shouldFadeBottom(elem: HTMLElement): boolean {
    return (elem.scrollHeight > elem.clientHeight);
  }

  onNotificationButtonClick(screenSize: 'desktop' | 'mobile') {
    this.notificationService.updateSeenNotifications();
    if (screenSize === 'mobile') {
      this._router.navigate(['/notification/list/my']);
    }
  }

}
