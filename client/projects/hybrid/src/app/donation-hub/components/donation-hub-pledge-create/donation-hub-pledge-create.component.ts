import { Component } from '@angular/core';
import { DonationHubPledgeCreateComponent as WebDonationHubPledgeCreateComponent } from '~web/donation-hub/components/donation-hub-pledge-create/donation-hub-pledge-create.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-create',
  templateUrl: './donation-hub-pledge-create.component.html',
  styleUrls: ['./donation-hub-pledge-create.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubPledgeCreateComponent extends WebDonationHubPledgeCreateComponent {}
