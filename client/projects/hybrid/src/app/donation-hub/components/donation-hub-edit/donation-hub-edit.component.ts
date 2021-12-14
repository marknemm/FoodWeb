import { Component } from '@angular/core';
import { DonationHubEditComponent as WebDonationHubEditComponent } from '~web/donation-hub/components/donation-hub-edit/donation-hub-edit.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-hub-edit',
  templateUrl: './donation-hub-edit.component.html',
  styleUrls: ['./donation-hub-edit.component.scss'],
  providers: [FormFieldService]
})
export class DonationHubEditComponent extends WebDonationHubEditComponent {}
