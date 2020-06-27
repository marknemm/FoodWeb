import { DeliveryScheduleRequest } from '../../../web';

export interface AdminDeliveryScheduleRequest extends DeliveryScheduleRequest {
  volunteerAccountId: number;
  sendNotifications?: boolean;
}
