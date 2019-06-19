import { Account } from '../account/account';
import { Delivery } from '../delivery/delivery';
export { Account, Delivery };

export type DonationStatus = 'Unmatched' | 'Matched' | 'Scheduled' | 'Picked Up' | 'Complete';

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
   * The estimated number of people that the donation will feed.
   */
  estimatedNumFeed: number;
  /**
   * The start time of the donation's pickup window.
   */
  pickupWindowStart: string;
  /**
   * The end time of the donation's pickup window.
   */
  pickupWindowEnd: string;
  /**
   * The current status of the donation.
   */
  donationStatus: DonationStatus;
  /**
   * Delivery data for the donation. Should be undefined/null if donation status is before scheduled state.
   */
  delivery?: Delivery;
  /**
   * The time of the most recent update. If the donationStatus is 'Complete', then this is garunteed to be the completion/delivery time.
   */
  lastUpdated?: string;
  /**
   * The time when the donation was originally created.
   */
  created?: string;
}
