import { Component, Input } from '@angular/core';
import { AccountType, Donation } from '~shared';

@Component({
  selector: 'foodweb-delivery-teaser',
  templateUrl: './delivery-teaser.component.html',
  styleUrls: ['./delivery-teaser.component.scss'],
})
export class DeliveryTeaserComponent {

  readonly AccountType = AccountType;

  @Input() donation: Donation;

}
