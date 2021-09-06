import { Component } from '@angular/core';
import { DonationEditComponent as WebDonationEditComponent } from '~web/donation/components/donation-edit/donation-edit.component';

@Component({
  selector: 'foodweb-hybrid-donation-edit',
  templateUrl: './donation-edit.component.html',
  styleUrls: ['./donation-edit.component.scss']
})
export class DonationEditComponent extends WebDonationEditComponent {}
