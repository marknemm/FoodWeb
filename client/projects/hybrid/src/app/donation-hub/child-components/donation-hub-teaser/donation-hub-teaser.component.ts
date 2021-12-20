import { Component } from '@angular/core';
import { DonationHubTeaserComponent as WebDonationHubTeaserComponent } from '~web/donation-hub/child-components/donation-hub-teaser/donation-hub-teaser.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-teaser',
  templateUrl: './donation-hub-teaser.component.html',
  styleUrls: ['./donation-hub-teaser.component.scss']
})
export class DonationHubTeaserComponent extends WebDonationHubTeaserComponent {}
