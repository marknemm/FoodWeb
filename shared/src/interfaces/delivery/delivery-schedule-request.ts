import { WriteRequest } from '../write-request';
import { DateTimeRange } from '../misc/time';

export interface DeliveryScheduleRequest extends WriteRequest {
  donationId: number;
  pickupWindow: DateTimeRange;
}
