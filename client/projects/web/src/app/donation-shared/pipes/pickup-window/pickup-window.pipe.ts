import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeRange, DeliveryHelper, Donation } from '~shared';

@Pipe({
  name: 'pickupWindow'
})
export class PickupWindowPipe implements PipeTransform {

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  transform(donation: Partial<Donation>): DateTimeRange {
    return this._deliveryHelper.getPickupWindow(donation);
  }

}
