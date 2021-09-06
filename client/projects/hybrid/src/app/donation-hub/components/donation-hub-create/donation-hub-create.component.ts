import { Component } from '@angular/core';
import { DonationHubCreateComponent as WebDonationHubCreateComponent } from '~web/donation-hub/components/donation-hub-create/donation-hub-create.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-create',
  templateUrl: './donation-hub-create.component.html',
  styleUrls: ['./donation-hub-create.component.scss'],
  providers: formProvider(DonationHubCreateComponent)
})
export class DonationHubCreateComponent extends WebDonationHubCreateComponent {}
