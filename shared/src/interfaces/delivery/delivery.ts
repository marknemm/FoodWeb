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
  pickupWindowStart: Date;
  /**
   * The end date-time of the estimated pickup window selected by the deliverer.
   */
  pickupWindowEnd: Date;
  /**
   * The time that the donation was picked-up from the donor.
   */
  pickupTime?: Date;
  /**
   * The time that the donation was dropped-off at the receiver.
   */
  dropOffTime?: Date;
}
