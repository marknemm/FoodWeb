import { DateTimeRange } from '../date-time/time';
import { WriteRequest } from '../write-request';

export interface DeliveryScheduleRequest extends WriteRequest {
  donationId: number;
  pickupWindow: DateTimeRange;
}
