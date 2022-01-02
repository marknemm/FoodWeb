import { Component } from '@angular/core';
import { DonationFormComponent as WebDonationFormComponent } from '~web/donation-shared/child-components/donation-form/donation-form.component';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-hybrid-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.scss'],
  providers: [FormFieldService]
})
export class DonationFormComponent extends WebDonationFormComponent {}
