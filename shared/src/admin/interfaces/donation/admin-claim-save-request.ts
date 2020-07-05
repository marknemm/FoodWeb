import { DonationClaimRequest } from '../../../web';

export interface AdminClaimSaveRequest extends DonationClaimRequest {
  receiverAccountId: number;
  sendNotifications: boolean;
}
