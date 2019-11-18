import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { faHandHoldingHeart, faGifts } from '@fortawesome/free-solid-svg-icons';
import { PageProgressService } from '~web/page-progress/page-progress.service';
import { ConstantsService } from '~web/constants/constants.service';
import { DonationHelper } from '~shared';

import { SessionService } from '~web/session/session.service';
import { LeftNavService } from '~web/left-nav/left-nav.service';

@Component({
  selector: 'food-web-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @ViewChild('drawerContent', { static: true }) drawerContent: MatDrawerContent;

  faHandHoldingHeart = faHandHoldingHeart;
  faGifts = faGifts;

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
