import { WriteRequest } from '../write-request';
import { Donation } from './donation';

export interface DonationUpdateRequest extends WriteRequest {
  donation: Donation;
}
