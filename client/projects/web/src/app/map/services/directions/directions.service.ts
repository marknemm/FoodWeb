import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { Directions, LatLng } from '~web/map/interfaces/map';
import { LatLngLiteral, Polyline, Waypoint } from '~web/map/map';
import { LocalStorageBucket, LocalStorageCacheService } from '~web/shared/services/local-storage-cache/local-storage-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  private static readonly DIRECTIONS_CACHE_KEY = 'foodWebDirectionsStore';
  private readonly _directionsCache: LocalStorageBucket<Waypoint[], Directions> = null;

  constructor(
    private _googleDirections: google.maps.DirectionsService,
    localStorageCacheService: LocalStorageCacheService
  ) {
    this._directionsCache = localStorageCacheService.getBucket(DirectionsService.DIRECTIONS_CACHE_KEY);
  }

  getDirections(route: LatLngLiteral[]): Observable<Directions> {
    return (this._directionsCache.hasItem(route))
      ? of(this._directionsCache.getItem(route))
      : this._queryDirections(route)
  }

  private _queryDirections(route: LatLngLiteral[]): Observable<Directions> {
    return new Observable<Directions>((subscriber: Subscriber<Directions>) => {
      const request: DirectionsRequest = this._genDirectionsRequest(route);
      this._googleDirections.route(request, (result: DirectionsResult, status: google.maps.DirectionsStatus) => {
        switch (status) {
          case DirectionsStatus.OK:
            subscriber.next(this._genDirections(route, result));
            break;
          case DirectionsStatus.OVER_QUERY_LIMIT:
            // TODO!!!
            break;
          default:
            subscriber.error(new Error(`Google Maps directions service failed with status: ${status}`));
        }
        subscriber.complete();
      });
    });
  }

  private _genDirectionsRequest(route: LatLngLiteral[]): DirectionsRequest {
    const middleWaypoints: DirectionsWaypoint[] = route.slice(1, route.length - 1).map(
      (latLng: LatLngLiteral) => ({ location: new google.maps.LatLng(latLng), stopover: true })
    );
    return {
      origin: route[0],
      destination: route[route.length - 1],
      travelMode: TravelMode.DRIVING,
      unitSystem: UnitSystem.IMPERIAL,
      waypoints: middleWaypoints
    };
  }

  private _genDirections(waypoints: LatLngLiteral[], result: DirectionsResult): Directions {
    const polylineColors = ['green', 'rgb(247, 148, 7)'];
    const directions: Directions = { waypoints, polylines: [] };
    if (result.routes.length !== 0) {
      result.routes[0].legs.forEach((leg: DirectionsLeg, idx: number) => {
        let path: google.maps.LatLng[] = [];
        leg.steps.forEach((step: DirectionsStep) =>
          path = path.concat(step.path)
        );
        directions.polylines.push(
          new google.maps.Polyline({ path, strokeColor: polylineColors[idx] })
        );
      });
    }
    return directions;
  }
}

type DirectionsLeg = google.maps.DirectionsLeg;
type DirectionsRequest = google.maps.DirectionsRequest;
type DirectionsResult = google.maps.DirectionsResult;
type DirectionsStep = google.maps.DirectionsStep;
type DirectionsWaypoint = google.maps.DirectionsWaypoint;

const DirectionsStatus = google.maps.DirectionsStatus;
const TravelMode = google.maps.TravelMode;
const UnitSystem = google.maps.UnitSystem;
