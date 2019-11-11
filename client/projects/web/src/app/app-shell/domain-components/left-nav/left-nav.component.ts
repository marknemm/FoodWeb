import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { ConstantsService, PageProgressService } from '~web/shared';
import { DonationHelper } from '~shared';

import { SessionService } from '~web/session/services/session/session.service';
import { LeftNavService } from '~web/app-shell/services/left-nav/left-nav.service';

@Component({
  selector: 'food-web-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('drawerContent', { static: true }) drawerContent: MatDrawerContent;

  constructor(
    public leftNavService: LeftNavService,
    public pageProgressService: PageProgressService,
    public sessionService: SessionService,
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper
  ) {}

  ngOnInit() {
    this.leftNavService.initDrawerContent(this.drawerContent);
  }

  _onNavClick(): void {
    if (this.leftNavService.mode === 'over') {
      this.leftNavService.toggle();
    }
  }
}
