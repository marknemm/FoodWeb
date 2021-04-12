import { Component, Input, OnInit } from '@angular/core';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';

@Component({
  selector: 'foodweb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() siteIconUri = './assets/icon-img-sm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService,
  ) {}

  ngOnInit() {}
}
