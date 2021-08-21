import { Component } from '@angular/core';
import { DonationHubPledgeComponent as WebDonationHubPledgeComponent } from '~web/donation-hub/components/donation-hub-pledge/donation-hub-pledge.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge',
  templateUrl: './donation-hub-pledge.component.html',
  styleUrls: ['./donation-hub-pledge.component.scss']
})
export class DonationHubPledgeComponent extends WebDonationHubPledgeComponent {

  readonly postDeleteRoute = ['/', 'tabs', 'donation-hub'];

}
