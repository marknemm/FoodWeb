import { Component } from '@angular/core';
import { DonationComponent as WebDonationComponent } from '~web/donation/components/donation/donation.component';

@Component({
  selector: 'foodweb-hybrid-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent extends WebDonationComponent {}
