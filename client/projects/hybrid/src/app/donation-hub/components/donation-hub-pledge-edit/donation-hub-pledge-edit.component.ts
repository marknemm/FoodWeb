import { Component } from '@angular/core';
import { DonationHubPledgeEditComponent as WebDonationHubPledgeEditComponent } from '~web/donation-hub/components/donation-hub-pledge-edit/donation-hub-pledge-edit.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-edit',
  templateUrl: './donation-hub-pledge-edit.component.html',
  styleUrls: ['./donation-hub-pledge-edit.component.scss'],
  providers: formProvider(DonationHubPledgeEditComponent)
})
export class DonationHubPledgeEditComponent extends WebDonationHubPledgeEditComponent {

  readonly postEditRoute = ['/', 'tabs', 'donation-hub', 'pledge'];

}
