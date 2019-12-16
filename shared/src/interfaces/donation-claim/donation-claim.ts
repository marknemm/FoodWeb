import { Account } from '../account/account';
import { Directions } from '../misc';
export { Account };

/**
 * A receiving organization's claim to a donation.
 */
export interface DonationClaim {
  /**
   * The (database) ID of the Donation Claim.
   */
  id?: number;
  /**
   * The account of the receiving organization which owns the claim.
   */
  receiverAccount: Account;
  /**
   * The distance (miles) from the Donor to the Receiver.
   */
  distanceMiToReceiver: number;
  /**
   * The driving duration (minutes) from the Donor to the Receiver.
   */
  durationMinToReceiver: number;
  /**
   * The driving directions from the Donor to the Receiver.
   */
  directionsToReceiver: Directions;
  /**
   * The time when the donation was claimed.
   */
  createTimestamp?: Date;
}
