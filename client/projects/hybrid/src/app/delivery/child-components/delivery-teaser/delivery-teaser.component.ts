import { Component } from '@angular/core';
import { DeliveryTeaserComponent as WebDeliveryTeaserComponent } from '~web/delivery/child-components/delivery-teaser/delivery-teaser.component';

@Component({
  selector: 'foodweb-hybrid-delivery-teaser',
  templateUrl: './delivery-teaser.component.html',
  styleUrls: ['./delivery-teaser.component.scss']
})
export class DeliveryTeaserComponent extends WebDeliveryTeaserComponent {}
