import { Account } from '../account/account';
export { Account };

/**
 * A donation.
 */
export interface Donation {
  /**
   * The (database) ID of the donation.
   */
  id?: number;
  /**
   * The account of the donor.
   */
  donorAccount: Account;
  /**
   * The last name of the individual submitting the donation.
   */
  donorLastName: string;
  /**
   * The first name of the individual submitting the donation.
   */
  donorFirstName: string;
  /**
   * The type of the donation.
   */
  donationType: string;
  /**
   * A description of the donation.
   */
  description: string;
  /**
   * The estimated monetary value of the donation.
   */
  estimatedValue: number;
}
