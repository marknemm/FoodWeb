import { DateTimeRange } from '../misc/time';

export interface DeliveryScheduleRequest {
  donationId: number;
  pickupWindow: DateTimeRange;
}
