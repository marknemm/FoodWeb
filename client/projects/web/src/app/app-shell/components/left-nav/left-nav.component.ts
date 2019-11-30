import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { faGifts, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DonationHelper } from '~shared';
import { LeftNavService } from '~web/app-shell/left-nav/left-nav.service';
import { SessionService } from '~web/session/session/session.service';
import { ConstantsService } from '~web/shared/constants/constants.service';
import { PageProgressService } from '~web/shared/page-progress/page-progress.service';

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
