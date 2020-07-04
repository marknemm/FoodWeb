import { Pipe, PipeTransform } from '@angular/core';
import { DeliveryHelper, Donation } from '~shared';

@Pipe({
  name: 'deliveryDetailsRouterLink'
})
export class DeliveryDetailsRouterLinkPipe implements PipeTransform {

  constructor(
    private _deliveryHelper: DeliveryHelper
  ) {}

  transform(donation: Partial<Donation>): string[] {
    return this._deliveryHelper.deliveryDetailsRouterLink(donation);
  }

}
