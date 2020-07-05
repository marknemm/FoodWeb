import { Pipe, PipeTransform } from '@angular/core';
import { AccountType, Donation, DonationHelper } from '~shared';

@Pipe({
  name: 'donationMemberName'
})
export class DonationMemberNamePipe implements PipeTransform {

  constructor(
    private _donationHelper: DonationHelper
  ) {}

  transform(donation: Partial<Donation>, accountType: AccountType): string {
    return this._donationHelper.memberName(donation, accountType);
  }

}
