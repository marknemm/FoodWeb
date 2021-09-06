import { Component } from '@angular/core';
import { PickupInfoComponent as WebPickupInfoComponent } from '~web/delivery/child-components/pickup-info/pickup-info.component';

@Component({
  selector: 'foodweb-hybrid-pickup-info',
  templateUrl: './pickup-info.component.html',
  styleUrls: ['./pickup-info.component.scss']
})
export class PickupInfoComponent extends WebPickupInfoComponent {}
