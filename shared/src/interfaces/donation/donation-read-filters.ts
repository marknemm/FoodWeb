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
  donationStatus?: DonationStatus;
  /**
   * Filters for associated donors' accounts.
   */
  donorAccountId?: number;
  /**
   * Filters for associated receivers' accounts.
   */
  receiverAccountId?: number;
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
}
