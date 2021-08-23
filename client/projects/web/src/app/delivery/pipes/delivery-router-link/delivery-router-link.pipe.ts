import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryHelper, Donation } from '~shared';

@Pipe({
  name: 'deliveryRouterLink'
})
export class DeliveryRouterLinkPipe implements PipeTransform {

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  transform(donation: Partial<Donation>): string[] {
    return this._deliveryHelper.deliveryDetailsRouterLink(donation);
  }

}
