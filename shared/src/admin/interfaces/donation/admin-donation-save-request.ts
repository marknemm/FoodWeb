import { DonationSaveRequest, Account } from '../../../web';

export interface AdminDonationSaveRequest extends DonationSaveRequest {
  sendNotifications: boolean;
}
