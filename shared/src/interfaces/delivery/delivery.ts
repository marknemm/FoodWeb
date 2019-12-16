import { Account } from '../account/account';
import { Directions } from '../misc';
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
   * The driving distance (miles) from the Volunteer's 'home' address to the Donor.
   */
  distanceMiToDonor: number;
  /**
   * The driving duration (minutes) from the Volunteer's 'home' address to the Donor.
   */
  durationMinToDonor: number;
  /**
   * The driving directions (path) from the Volunteer 'home' to the Donor.
   * Contains a list of GPS coordinates denoting the segments of a map polyline used to plot the path.
   */
  directionsToDonor: Directions;
  /**
   * The time that the donation was picked-up from the donor.
   */
  pickupTime?: Date;
  /**
   * The time that the donation was dropped-off at the receiver.
   */
  dropOffTime?: Date;
  /**
   * The time when the donation delivery was scheduled (created).
   */
  createTimestamp?: Date;
}
