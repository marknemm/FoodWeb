import { Component } from '@angular/core';
import { DonationHubPledgeActionsComponent as WebDonationHubPledgeActionsComponent } from '~web/donation-hub/child-components/donation-hub-pledge-actions/donation-hub-pledge-actions.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-actions',
  templateUrl: './donation-hub-pledge-actions.component.html',
  styleUrls: ['./donation-hub-pledge-actions.component.scss']
})
export class DonationHubPledgeActionsComponent extends WebDonationHubPledgeActionsComponent {}
