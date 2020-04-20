import { WriteRequest } from '../write-request';
import { Donation } from './donation';

export interface DonationCreateRequest extends WriteRequest {
  donation: Donation;
}
