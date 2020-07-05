import { Injectable } from '@angular/core';
import { Constants, DonationStatus } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService extends Constants {

  ACCOUNT_TYPE_ICONS = {
    Donor: 'card_giftcard',
    Receiver: 'shopping_basket',
    Volunteer: 'time_to_leave',
    Admin: 'vpn_key'
  };

  getDeliveryStatuses(includeMatched = false): DonationStatus[] {
    const deliveryStatuses = this.DONATION_STATUSES.filter(
      (status: DonationStatus) => (status !== DonationStatus.Unmatched) && (status !== DonationStatus.Matched)
    );
    if (includeMatched) {
      deliveryStatuses.unshift(DonationStatus.Matched);
    }
    return deliveryStatuses;
  }
}
