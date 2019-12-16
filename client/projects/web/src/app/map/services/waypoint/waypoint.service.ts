import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { MapWaypointConverter, Waypoint } from '~shared';
import { ClientWaypoint, LatLngLiteral } from '~web/map/map';
import { PositionService } from '~web/map/position/position.service';

@Injectable({
  providedIn: 'root'
})
export class WaypointService {

  constructor(
    private _positionService: PositionService,
    private _mapWaypointConverter: MapWaypointConverter
  ) {}

  /**
   * Converts a list of (client) waypoints to GPS (lat-lng) coordinates.
   * @param waypoints The waypoints that are to be converted.
   * @return The lat-lng conversion results.
   */
  waypointsToLatLngLiterals(waypoints: ClientWaypoint[]): Observable<LatLngLiteral[]> {
    return new Observable<LatLngLiteral[]>((subscriber: Subscriber<LatLngLiteral[]>) => {
      const latLngLiterals: LatLngLiteral[] = [];
      let currentPosition$: Observable<LatLngLiteral> = of(null);
      let currentPositionIdx = -1;

      // Convert all waypoints to lat-lng literals. If we encounter 'My+Location', set observable to current location request.
      if (waypoints) {
        waypoints.forEach((waypoint: ClientWaypoint, idx: number) => {
          if (waypoint === 'My+Location') {
            currentPositionIdx = idx;
            currentPosition$ = this._positionService.refreshCurrentPosition();
          } else {
            latLngLiterals.push(
              this.waypointToLatLngLiteral(waypoint)
            );
          }
        });
      }

      // Listen for browser to respond with the lookup result for the user's current location.
      currentPosition$.subscribe((position: LatLngLiteral) => {
        if (position) {
          latLngLiterals.splice(currentPositionIdx, 0, position);
        }
        // Actually emit the result of converting waypoints to lat-lng literals.
        subscriber.next(latLngLiterals);
        subscriber.complete();
      });
    });
  }

  /**
   * Converts a (client) waypoint to a GPS (lat-lng) coordinate.
   * @param waypoint The waypoint that is to be converted.
   * @return The lat-lng conversion result.
   */
  waypointToLatLngLiteral(waypoint: ClientWaypoint): LatLngLiteral {
    if ((<Position>waypoint).coords) {
      return this._positionService.positionToLatLngLiteral(<Position>waypoint);
    }
    return this._mapWaypointConverter.waypointToLatLngLiteral(<Waypoint>waypoint);
  }
}
