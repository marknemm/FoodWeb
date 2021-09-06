import { Component } from '@angular/core';
import { DonationTeaserComponent as WebDonationTeaserComponent } from '~web/donation/child-components/donation-teaser/donation-teaser.component';

@Component({
  selector: 'foodweb-hybrid-donation-teaser',
  templateUrl: './donation-teaser.component.html',
  styleUrls: ['./donation-teaser.component.scss']
})
export class DonationTeaserComponent extends WebDonationTeaserComponent {}
