import { LatLngLiteral } from '../map/map';

export interface DeliveryStateChangeRequest {
  donationId: number;
  currentLocation: LatLngLiteral;
  deliveryId?: number;
}
