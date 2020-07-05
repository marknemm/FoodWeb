import { Pipe, PipeTransform } from '@angular/core';
import { Donation } from '~shared';

@Pipe({
  name: 'donationDetailsRouterLink'
})
export class DonationDetailsRouterLinkPipe implements PipeTransform {

  transform(donation: Partial<Donation>): string[] {
    return (donation) ? ['/donation/details/', `${donation.id}`] : [];
  }

}
