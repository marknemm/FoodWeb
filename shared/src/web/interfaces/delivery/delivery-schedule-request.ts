import { DateTimeRange } from '../date-time/time';

export interface DeliveryScheduleRequest {
  donationId: number;
  pickupWindow: DateTimeRange;
}
