import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawerContent } from '@angular/material/sidenav';
import { LeftNavService } from '../../services/left-nav/left-nav.service';
import { PageProgressService } from '../../../shared/services/page-progress/page-progress.service';
import { SessionService } from '../../../session/services/session/session.service';
import { ConstantsService } from '../../../shared/services/constants/constants.service';
import { DonationHelper } from '../../../../../../shared/src/helpers/donation-helper';

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
