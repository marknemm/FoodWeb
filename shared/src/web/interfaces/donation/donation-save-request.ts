import { WriteRequest } from '../write-request';
import { DonationSaveData } from './donation-save-data';

export interface DonationSaveRequest extends WriteRequest {
  donationSaveData: DonationSaveData;
}
