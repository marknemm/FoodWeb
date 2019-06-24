import { Account } from '../account/account';
export { Account };

/**
 * Delivery data for a donation.
 */
export interface Delivery {
  id?: number;
  /**
   * The account of the volunteer driver.
   */
  volunteerAccount: Account;
  /**
   * The begin date-time of the estimated pickup window selected by the deliverer.
   */
  pickupWindowStart: string;
  /**
   * The end date-time of the estimated pickup window selected by the deliverer.
   */
  pickupWindowEnd: string;
  /**
   * The time that the donation was picked-up from the donor.
   */
  pickupTime?: string;
  /**
   * The time that the donation was dropped-off at the receiver.
   */
  dropOffTime?: string;
}