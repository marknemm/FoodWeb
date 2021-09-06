import { Component } from '@angular/core';
import { DeliveryDonationInfoComponent as WebDeliveryDonationInfoComponent } from '~web/delivery/child-components/delivery-donation-info/delivery-donation-info.component';

@Component({
  selector: 'foodweb-hybrid-delivery-donation-info',
  templateUrl: './delivery-donation-info.component.html',
  styleUrls: ['./delivery-donation-info.component.scss']
})
export class DeliveryDonationInfoComponent extends WebDeliveryDonationInfoComponent {}
