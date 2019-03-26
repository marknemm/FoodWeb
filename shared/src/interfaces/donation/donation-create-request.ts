import { Donation } from './donation';
export { Donation };

/**
 * Request for creating a donation.
 */
export interface DonationCreateRequest {
  donation: Donation;
}
