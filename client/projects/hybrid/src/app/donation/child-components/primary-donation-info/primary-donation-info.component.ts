import { Component } from '@angular/core';
import { PrimaryDonationInfoComponent as WebPrimaryDonationInfoComponent } from '~web/donation/child-components/primary-donation-info/primary-donation-info.component';

@Component({
  selector: 'foodweb-hybrid-primary-donation-info',
  templateUrl: './primary-donation-info.component.html',
  styleUrls: ['./primary-donation-info.component.scss']
})
export class PrimaryDonationInfoComponent extends WebPrimaryDonationInfoComponent {}
