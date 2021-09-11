import { Component } from '@angular/core';
import { DonationHubCreateComponent as WebDonationHubCreateComponent } from '~web/donation-hub/components/donation-hub-create/donation-hub-create.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-create',
  templateUrl: './donation-hub-create.component.html',
  styleUrls: ['./donation-hub-create.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubCreateComponent extends WebDonationHubCreateComponent {}
