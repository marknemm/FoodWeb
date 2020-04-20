import { WriteRequest } from '../write-request';

/**
 * A donation unclaim request that is submitted by a receiver.
 */
export interface DonationUnclaimRequest extends WriteRequest {
  /**
   * The ID of the donation to unclaim.
   */
  donationId: number;
}
