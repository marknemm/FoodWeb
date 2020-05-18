import { WriteRequest } from '../write-request';
import { Donation } from './donation';

export interface DonationSaveRequest extends WriteRequest {
  donation: Donation;
}
