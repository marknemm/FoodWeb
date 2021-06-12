import { Injectable } from '@angular/core';
import { Constants, DonationStatus } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService extends Constants {

  ACCOUNT_CATEGORY_ICONS = {
    Business: 'business',
    Volunteer: 'volunteer_activism'
  };

  ACCOUNT_TYPE_ICONS = {
    Donor: 'card_giftcard',
    Receiver: 'shopping_basket',
    Volunteer: this.ACCOUNT_CATEGORY_ICONS.Volunteer,
    Admin: 'vpn_key'
  };

  /**
   * Gets all Donation statuses that are associated with delivery stages.
   * @param includeMatched Whether or not to include the DonationStatus member Matched in the returned statuses.
   * @returns A list of DonationStatus members associated with delivery stages.
   */
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
