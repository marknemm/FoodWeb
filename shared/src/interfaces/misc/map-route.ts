import { Directions } from './map';
import { GeographyLocation } from '../account';
export { Directions };

export interface MapRoute {
  /**
   * The auto-generated database entry ID.
   */
  id?: number;
  /**
   * The driving distance (miles) from the route origin to destination.
   */
  distanceMi: number;
  /**
   * The driving duration (minutes) from the route origin to destination.
   */
  durationMin: number;
  /**
   * The driving directions from the Donor to the Receiver.
   */
  directions: Directions;
  /**
   * The end GPS (geography) location for the route.
   */
  endLocation: GeographyLocation;
  /**
   * The start GPS (geography) location for the route.
   */
  startLocation: GeographyLocation;
}
