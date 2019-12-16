import { LatLngLiteral } from '@google/maps';
import { ContactInfo, GeographyLocation } from '../account';
export { LatLngLiteral };

/**
 * Contains the full set of directions for a route which may contain several waypoints.
 */
export interface Directions {
  distanceMi: number;
  durationMin: number;
  waypointSegments: WaypointSegment[];
}

/**
 * A segment of the final result from the directions query.
 * Each segment represents the directions between each adjacent pair of waypoints that the directions were computed for.
 */
export interface WaypointSegment {
  distanceMi: number;
  durationMin: number;
  steps: StepSegment[];
}

/**
 * Contains one of a series of atomic steps for map directions.
 * The atomic steps of map directions correlate to the set of smallest point-to-point segments that can be rendered to a map.
 */
export interface StepSegment {
  distanceMi: number;
  durationMin: number;
  endLatLng: LatLngLiteral;
  htmlInstructions: string;
  startLatLng: LatLngLiteral;
}

export type Waypoint = GeographyLocation | LatLngLiteral | ContactInfo;
