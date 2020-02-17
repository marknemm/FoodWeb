import { Component, OnInit, Input } from '@angular/core';
import { LeftNavService } from '~web/app-shell/left-nav/left-nav.service';
import { NotificationService } from '~web/notification/notification/notification.service';
import { SessionService } from '~web/session/session/session.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-header',
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
