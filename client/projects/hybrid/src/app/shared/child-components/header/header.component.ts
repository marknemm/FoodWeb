import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';

@Component({
  selector: 'foodweb-hybrid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() defaultBackHref: string;
  @Input() omitBackHref = false;
  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public notificationService: NotificationService,
    public pageProgressService: PageProgressService,
    public sessionService: SessionService,
  ) {}

  ngOnInit() {}
}
