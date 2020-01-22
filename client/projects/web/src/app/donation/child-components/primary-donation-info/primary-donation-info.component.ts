import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DateTimeRange, DeliveryHelper, Donation } from '~shared';

@Component({
  selector: 'food-web-primary-donation-info',
  templateUrl: './primary-donation-info.component.html',
  styleUrls: ['./primary-donation-info.component.scss'],
})
export class PrimaryDonationInfoComponent implements OnChanges {

  @Input() donation: Donation;
  @Input() myDonation = false;

  private _dropOffWindow: DateTimeRange;
  private _pickupWindow: DateTimeRange;

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  get dropOffWindow(): DateTimeRange {
    return this._dropOffWindow;
  }

  get pickupWindow(): DateTimeRange {
    return this._pickupWindow;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.donation) {
      this._dropOffWindow = this._deliveryHelper.getDropOffWindow(this.donation);
      this._pickupWindow = this._deliveryHelper.getPickupWindow(this.donation);
    }
  }

}
