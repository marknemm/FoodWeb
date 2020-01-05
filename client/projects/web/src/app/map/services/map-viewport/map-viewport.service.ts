import { Injectable } from '@angular/core';
import { LatLngLiteral } from '~shared';
import { LatLngBounds } from '~web/map/interfaces/map';

@Injectable({
  providedIn: 'root'
})
export class MapViewportService {

  constructor() {}

  /**
   * Calculates the map viewport bounds that will fit a given set of map GPS (lat-lng) coordinate waypoints.
   * @param latLngWaypoints The map waypoints that must be fit within the viewport.
   * @return The calculated map viewport bounds.
   */
  calcMapBounds(latLngWaypoints: LatLngLiteral[]): LatLngBounds {
    let mapBounds = new google.maps.LatLngBounds();

    // Return immediately if given falsy/empty lat/lng literals array.
    if (!latLngWaypoints || latLngWaypoints.length === 0) {
      return mapBounds;
    }

    latLngWaypoints.forEach((latLngLiteral: LatLngLiteral) =>
      mapBounds = mapBounds.extend(latLngLiteral)
    );
    return mapBounds;
  }
}
