import { Component, Input, OnInit } from '@angular/core';
import { LeftNavService } from '~web/app-shell/services/left-nav/left-nav.service';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public sessionService: SessionService,
    public pageTitleService: PageTitleService,
    public pageProgressService: PageProgressService,
    public leftNavService: LeftNavService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {}
}
