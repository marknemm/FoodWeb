import { Component } from '@angular/core';
import { DonationHubPledgeTableComponent } from '~web/donation-hub/child-components/donation-hub-pledge-table/donation-hub-pledge-table.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-mini-list',
  templateUrl: './donation-hub-pledge-mini-list.component.html',
  styleUrls: ['./donation-hub-pledge-mini-list.component.scss']
})
export class DonationHubPledgeMiniListComponent extends DonationHubPledgeTableComponent {}
