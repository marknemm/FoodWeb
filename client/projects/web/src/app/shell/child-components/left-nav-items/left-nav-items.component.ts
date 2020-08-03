import { Component, OnInit } from '@angular/core';
import { faDonate, faGifts, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DonationHelper } from '~shared';
import { LeftNavService } from '~web/shell/services/left-nav/left-nav.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';

@Component({
  selector: 'foodweb-left-nav-items',
  templateUrl: './left-nav-items.component.html',
  styleUrls: ['./left-nav-items.component.scss'],
})
export class LeftNavItemsComponent implements OnInit {

  faDonate = faDonate;
  faGifts = faGifts;
  faHandHoldingHeart = faHandHoldingHeart;

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService,
    private _leftNavService: LeftNavService
  ) {}

  ngOnInit() {}

  _onNavigate(): void {
    if (this._leftNavService.mode === 'over') {
      this._leftNavService.toggle();
    }
  }

}
