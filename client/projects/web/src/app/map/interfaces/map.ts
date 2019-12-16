import { Waypoint } from '~shared';
export { Waypoint };

export type LatLng = google.maps.LatLng;
export type LatLngBounds = google.maps.LatLngBounds;
export type LatLngLiteral = google.maps.LatLngLiteral;

export type MapOptions = google.maps.MapOptions;

export type ClientWaypoint = 'My+Location' | Position | Waypoint;

export interface Directions {
  waypoints: Waypoint[]
  polylines: Polyline[];
}

export type Polyline = google.maps.Polyline;

