import { DeliveryScheduleRequest } from '../../../web';

export interface AdminDeliverySaveRequest extends DeliveryScheduleRequest {
  volunteerAccountId: number;
  startTime?: Date;
  pickupTime?: Date;
  dropOffTime?: Date;
  sendNotifications?: boolean;
}
