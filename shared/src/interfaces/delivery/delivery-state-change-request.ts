import { WriteRequest } from '../write-request';
import { LatLngLiteral } from '../misc/map';

export interface DeliveryStateChangeRequest extends WriteRequest {
  donationId: number;
  currentLocation: LatLngLiteral;
  deliveryId?: number;
}
