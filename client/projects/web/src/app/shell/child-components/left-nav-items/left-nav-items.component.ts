import { Component, OnInit } from '@angular/core';
import { faDonate, faGifts, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { DonationHelper } from '~shared';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { FeatureFlagService } from '~web/shared/services/feature-flag/feature-flag.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-left-nav-items',
  templateUrl: './left-nav-items.component.html',
  styleUrls: ['./left-nav-items.component.scss'],
})
export class LeftNavItemsComponent implements OnInit {

  faDonate = faDonate;
  faGifts = faGifts;
  faHandHoldingHeart = faHandHoldingHeart;

  private _showDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService,
    private _authService: AuthenticationService,
    private _featureFlagService: FeatureFlagService,
    private _shellService: ShellService,
  ) {}

  get showDeliveries(): boolean {
    return this._showDeliveries;
  }

  ngOnInit(): void {
    this._showDeliveries = this._featureFlagService.hasTruthyFeatureFlag('showDeliveries');
  }

  _onNavigate(): void {
    this._shellService.toggleLeftNav();
  }

  showLoginDialog(): void {
    this._shellService.toggleLeftNav();
    this._authService.openLoginDialogIfNotLoggedIn();
  }

}
