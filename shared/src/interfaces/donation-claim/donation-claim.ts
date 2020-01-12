import { Account } from '../account/account';
import { Delivery } from '../delivery';
import { MapRoute } from '../misc/map-route';
export { Account, MapRoute };

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
   * The delivery for the claimed donation.
   * Should be undefined/null if donation status is before scheduled state.
   */
  delivery?: Delivery;
  /**
   * The start date-time of the estimated drop-off window.
   */
  dropOffWindowStart: Date;
  /**
   * The end date-time of the estimated drop-off window.
   */
  dropOffWindowEnd: Date;
  /**
   * The driving route from the Donor to the Receiver.
   */
  routeToReceiver: MapRoute;
  /**
   * The time when the donation was claimed.
   */
  createTimestamp?: Date;
}
