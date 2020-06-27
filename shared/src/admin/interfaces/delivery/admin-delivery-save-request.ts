import { WriteRequest } from '../../../web';
import { AdminDeliverySaveData } from './admin-delivery-save-data';

export interface AdminDeliverySaveRequest extends WriteRequest {
  donationId: number;
  delivery: AdminDeliverySaveData;
  volunteerAccountId: number;
  sendNotifications?: boolean;
}
