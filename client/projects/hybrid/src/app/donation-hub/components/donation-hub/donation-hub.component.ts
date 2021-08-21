import { Component } from '@angular/core';
import { DonationHubComponent as WebDonationHubComponent } from '~web/donation-hub/components/donation-hub/donation-hub.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub',
  templateUrl: './donation-hub.component.html',
  styleUrls: ['./donation-hub.component.scss']
})
export class DonationHubComponent extends WebDonationHubComponent {

  readonly pledgeSelectRoute = ['/', 'tabs', 'donation-hub', 'pledge'];
  readonly postDeleteRoute = ['/', 'tabs', 'donation-hub', 'list', 'my'];

}
