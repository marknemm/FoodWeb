import { Component, Input } from '@angular/core';
import { Account, DonationHub } from '~shared';

/**
 * A teaser for a donation hub.
 */
@Component({
  selector: 'foodweb-donation-hub-teaser',
  templateUrl: './donation-hub-teaser.component.html',
  styleUrls: ['./donation-hub-teaser.component.scss']
})
export class DonationHubTeaserComponent {

  @Input() donationHub: DonationHub;
  @Input() hideDonateButton = false;

  constructor() {}

  get hubAccount(): Account {
    return this.donationHub?.volunteerAccount;
  }
}
