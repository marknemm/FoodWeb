import { Pipe, PipeTransform } from '@angular/core';
import { Donation } from '~shared';

@Pipe({
  name: 'donationRouterLink'
})
export class DonationRouterLinkPipe implements PipeTransform {

  transform(donation: Partial<Donation>): string[] {
    return (donation) ? ['/', 'donation', `${donation.id}`] : [];
  }

}
