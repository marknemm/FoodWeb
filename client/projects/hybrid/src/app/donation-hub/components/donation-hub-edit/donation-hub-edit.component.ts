import { Component } from '@angular/core';
import { DonationHubEditComponent as WebDonationHubEditComponent } from '~web/donation-hub/components/donation-hub-edit/donation-hub-edit.component';
import { formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-edit',
  templateUrl: './donation-hub-edit.component.html',
  styleUrls: ['./donation-hub-edit.component.scss'],
  providers: formProvider(DonationHubEditComponent)
})
export class DonationHubEditComponent extends WebDonationHubEditComponent {}
