import { Component, Input, OnInit } from '@angular/core';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Component({
  selector: 'foodweb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService,
    public pageTitleService: PageTitleService
  ) {}

  ngOnInit() {}
}
