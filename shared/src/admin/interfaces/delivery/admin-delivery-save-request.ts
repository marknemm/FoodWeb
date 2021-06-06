import { AdminDeliverySaveData } from './admin-delivery-save-data';

export interface AdminDeliverySaveRequest {
  donationId: number;
  delivery: AdminDeliverySaveData;
  volunteerAccountId: number;
  sendNotifications?: boolean;
}
