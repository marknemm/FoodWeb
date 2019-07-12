import { WriteRequest } from '../write-request';

/**
 * A donation claim request that is submitted by a receiver.
 */
export interface DonationClaimRequest extends WriteRequest {
  /**
   * The ID of the donation to claim.
   */
  donationId: number;
}
