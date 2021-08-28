import { Component } from '@angular/core';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { SessionService } from '~web/session/services/session/session.service';

@Component({
  selector: 'foodweb-hybrid-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  constructor(
    public notificationService: NotificationService,
    public sessionService: SessionService
  ) {}

}
