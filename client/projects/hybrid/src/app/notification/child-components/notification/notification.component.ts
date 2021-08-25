import { Component } from '@angular/core';
import { NotificationComponent as WebNotificationComponent } from '~web/notification-shared/child-components/notification/notification.component';

@Component({
  selector: 'foodweb-hybrid-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends WebNotificationComponent {}
