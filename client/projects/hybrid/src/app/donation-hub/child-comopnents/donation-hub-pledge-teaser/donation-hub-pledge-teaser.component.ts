import { Component } from '@angular/core';
import { DonationHubPledgeTeaserComponent as WebDonationHubPledgeTeaserComponent } from '~web/donation-hub/child-components/donation-hub-pledge-teaser/donation-hub-pledge-teaser.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-teaser',
  templateUrl: './donation-hub-pledge-teaser.component.html',
  styleUrls: ['./donation-hub-pledge-teaser.component.scss']
})
export class DonationHubPledgeTeaserComponent extends WebDonationHubPledgeTeaserComponent {}
