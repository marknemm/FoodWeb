import { Component } from '@angular/core';
import { DonationHubActionsComponent as WebDonationHubActionsComponent } from '~web/donation-hub/child-components/donation-hub-actions/donation-hub-actions.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-actions',
  templateUrl: './donation-hub-actions.component.html',
  styleUrls: ['./donation-hub-actions.component.scss']
})
export class DonationHubActionsComponent extends WebDonationHubActionsComponent {}
