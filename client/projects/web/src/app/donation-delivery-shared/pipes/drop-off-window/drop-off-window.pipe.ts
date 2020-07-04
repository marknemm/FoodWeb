import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeRange, DeliveryHelper, Donation } from '~shared';

@Pipe({
  name: 'dropOffWindow'
})
export class DropOffWindowPipe implements PipeTransform {

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  transform(donation: Partial<Donation>): DateTimeRange {
    return this._deliveryHelper.getDropOffWindow(donation);
  }

}
