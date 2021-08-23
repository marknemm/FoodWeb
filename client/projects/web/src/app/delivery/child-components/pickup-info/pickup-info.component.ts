import { Component, Input } from '@angular/core';
import { Donation } from '~shared';

@Component({
  selector: 'foodweb-pickup-info',
  templateUrl: './pickup-info.component.html',
  styleUrls: ['./pickup-info.component.scss'],
})
export class PickupInfoComponent {

  @Input() donation: Donation;

}
