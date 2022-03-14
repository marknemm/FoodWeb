import { Component, OnInit } from '@angular/core';
import { faGifts, faHamburger, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DonationHelper } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FeatureFlagService } from '~web/shared/services/feature-flag/feature-flag.service';

@Component({
  selector: 'foodweb-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  readonly faHandHoldingHeart = faHandHoldingHeart;
  readonly faGifts = faGifts;
  readonly faHamburger = faHamburger;

  private _showDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService,
    private _featureFlag: FeatureFlagService
  ) {}

  /**
   * Whether or not deliveries navigation buttons/menus should be shown (based on feature flag query param).
   */
  get showDeliveries(): boolean {
    return this._showDeliveries;
  }

  ngOnInit(): void {
    this._showDeliveries = this._featureFlag.hasTruthyFeatureFlag('showDeliveries');
  }

}
