import { Component } from '@angular/core';
import { DonationHubPledgeFormComponent as WebDonationHubPledgeFormComponent } from '~web/donation-hub/child-components/donation-hub-pledge-form/donation-hub-pledge-form.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-form',
  templateUrl: './donation-hub-pledge-form.component.html',
  styleUrls: ['./donation-hub-pledge-form.component.scss'],
  providers: formProvider(DonationHubPledgeFormComponent)
})
export class DonationHubPledgeFormComponent extends WebDonationHubPledgeFormComponent {}
