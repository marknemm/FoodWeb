import { LatLngLiteral } from '../map/map';
import { WriteRequest } from '../write-request';

export interface DeliveryStateChangeRequest extends WriteRequest {
  donationId: number;
  currentLocation: LatLngLiteral;
  deliveryId?: number;
}
