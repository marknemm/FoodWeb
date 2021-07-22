import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '~web/notification/services/notification/notification.service';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-hybrid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public notificationService: NotificationService,
    public pageProgressService: PageProgressService,
    public pageTitleService: PageTitleService,
  ) {}

  ngOnInit() {}
}
