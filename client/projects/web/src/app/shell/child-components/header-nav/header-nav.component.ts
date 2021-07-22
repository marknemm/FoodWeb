import { Component, OnInit } from '@angular/core';
import { DonationHelper } from '~shared';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { faHandHoldingHeart, faGifts, faHamburger } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'foodweb-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss']
})
export class HeaderNavComponent implements OnInit {

  readonly faHandHoldingHeart = faHandHoldingHeart;
  readonly faGifts = faGifts;
  readonly faHamburger = faHamburger;

  constructor(
    public constantsService: ConstantsService,
    public donationHelper: DonationHelper,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

}
