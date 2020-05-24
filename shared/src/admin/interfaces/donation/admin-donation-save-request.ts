import { DonationSaveRequest } from '../../../web';
import { AdminClaimSaveRequest } from './admin-claim-save-request';
import { AdminDeliverySaveRequest } from './admin-delivery-save-request';

export interface AdminDonationSaveRequest extends DonationSaveRequest {
  donorAccountId: number;
  claimSaveReq?: AdminClaimSaveRequest;
  deliverySaveReq?: AdminDeliverySaveRequest;
  sendNotifications?: boolean;
}
