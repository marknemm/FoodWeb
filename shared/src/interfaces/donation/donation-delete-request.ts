import { WriteRequest } from '../write-request';

export interface DonationDeleteRequest extends WriteRequest {
  donationId: number;
}
