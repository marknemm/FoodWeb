import { Component } from '@angular/core';
import { DeliveryComponent as WebDeliveryComponent } from '~web/delivery/components/delivery/delivery.component';

@Component({
  selector: 'foodweb-hybrid-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent extends WebDeliveryComponent {}
