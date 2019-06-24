import { WriteRequest } from '../write-request';

export interface DeliveryStateChangeRequest extends WriteRequest {
  donationId: number;
  deliveryId?: number;
}
