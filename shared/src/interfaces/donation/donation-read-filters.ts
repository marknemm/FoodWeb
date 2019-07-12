import { Omit } from 'utility-types';
import { AccountReadFilters } from '../account/account-read-filters';
import { DonationStatus } from './donation';

/**
 * Filter definition for a donors' accounts that are associated with donations.
 */
export interface AccountFilters extends Omit<AccountReadFilters, 'accountType'> {}

export interface DonationReadFilters {
  /**
   * The ID of the donation.
   */
  id?: number;
  /**
   * The status of the donation.
   */
  donationStatus?: DonationStatus | string;
  /**
   * Filters for associated donors' accounts.
   */
  donorAccountId?: number;
  /**
   * Filters for associated receivers' accounts.
   */
  receiverAccountId?: number;
  /**
   * Filters for associated deliverers' accounts.
   */
  delivererAccountId?: number;
  /**
   * The last name of the person who submitted the donation.
   */
  donorLastName?: string;
  /**
   * The first name of the person who submitted the donation.
   */
  donorFirstName?: string;
  /**
   * The type of the donation.
   */
  donationType?: string;
  /**
   * If true, then only expired donations will come back. If false, then no expired donations will come back.
   */
  expired?: string;
  /**
   * Set to true if filtering donations belonging to current user.
   */
  myDonations?: boolean;
}
