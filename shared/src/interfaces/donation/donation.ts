import { Account } from '../account/account';
export { Account };

export type DonationStatus = 'Unmatched' | 'Matched' | 'Complete';

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
   * The account of the receiving organization.
   */
  receiverAccount?: Account;
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
  /**
   * The current status of the donation.
   */
  donationStatus: DonationStatus;
  /**
   * The time of the most recent update. If the donationStatus is 'Complete', then this is garunteed to be the completion/delivery time.
   */
  lastUpdated?: string;
}
