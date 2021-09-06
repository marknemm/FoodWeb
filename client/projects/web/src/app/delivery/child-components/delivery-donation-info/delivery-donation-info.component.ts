import { Component, Input } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'foodweb-delivery-donation-info',
  templateUrl: './delivery-donation-info.component.html',
  styleUrls: ['./delivery-donation-info.component.scss'],
})
export class DeliveryDonationInfoComponent {

  @Input() donation: Donation;

}
