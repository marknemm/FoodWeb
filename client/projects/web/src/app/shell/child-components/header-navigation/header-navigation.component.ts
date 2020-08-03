import { Component, OnInit } from '@angular/core';
import { DonationHelper } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { faHandHoldingHeart, faGifts } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'foodweb-header-navigation',
  templateUrl: './header-navigation.component.html',
  styleUrls: ['./header-navigation.component.scss']
})
export class HeaderNavigationComponent implements OnInit {

  readonly faHandHoldingHeart = faHandHoldingHeart;
  readonly faGifts = faGifts;

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
