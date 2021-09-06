import { Component, Input, OnInit } from '@angular/core';
import { PageProgressService } from '~web/shared/services/page-progress/page-progress.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() siteIconUri = './assets/IconImgSm.png';
  @Input() siteTitle = 'FoodWeb';

  constructor(
    public pageProgressService: PageProgressService,
    public pageTitleService: PageTitleService,
    public shellService: ShellService,
  ) {}

  ngOnInit() {}
}
