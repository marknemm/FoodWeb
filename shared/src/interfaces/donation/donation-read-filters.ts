import { Omit } from 'utility-types';
import { AccountReadFilters } from '../account/account-read-filters';

/**
 * Filter definition for a donors' accounts that are associated with donations.
 */
export interface DonorAccountFilters extends Omit<AccountReadFilters, 'accountType'> {}

export interface DonationReadFilters {
  /**
   * The ID of the donation.
   */
  id?: number;
  /**
   * Filters for associated donors' accounts.
   */
  donorAccountFilters?: DonorAccountFilters;
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
