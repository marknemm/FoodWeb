import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeRange, DeliveryHelper, Donation } from '~shared';

@Component({
  selector: 'food-web-pickup-info',
  templateUrl: './pickup-info.component.html',
  styleUrls: ['./pickup-info.component.scss'],
})
export class PickupInfoComponent implements OnChanges {

  @Input() donation: Donation;

  private _pickupWindow: DateTimeRange;

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  get pickupWindow(): DateTimeRange {
    return this._pickupWindow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donation) {
      this._pickupWindow = this._deliveryHelper.getPickupWindow(this.donation);
    }
  }

}
