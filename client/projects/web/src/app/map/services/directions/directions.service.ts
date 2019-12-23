import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectionsExtractor, Donation, WaypointSegment } from '~shared';
import { Directions, LatLng, Polyline } from '~web/map/interfaces/map';
import { LatLngLiteral, Waypoint } from '~web/map/map';
import { LocalStorageBucket, LocalStorageCacheService } from '~web/shared/local-storage-cache/local-storage-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  static readonly DEFAULT_POLYLINE_COLORS: string[] = ['green', 'rgb(247, 148, 7)', 'blue', 'purple', 'cyan', 'red'];

  private static readonly DIRECTIONS_CACHE_KEY = 'foodWebDirectionsStore';
  private readonly _directionsCache: LocalStorageBucket<Waypoint[], Directions> = null;

  constructor(
    private _directionsExtractor: DirectionsExtractor,
    private _googleDirections: google.maps.DirectionsService,
    localStorageCacheService: LocalStorageCacheService
  ) {
    this._directionsCache = localStorageCacheService.getBucket(DirectionsService.DIRECTIONS_CACHE_KEY);
  }

  /**
   * Extracts a set of directions from a given donation.
   * @param donation The donation from which to extract directions from.
   * @return The extracted donation directions.
   */
  extractDirectionsFromDonation(donation: Donation): Directions {
    const directionsToDonor: Directions = donation.delivery
      ? donation.delivery.directionsToDonor
      : { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
    const directionsToReceiver: Directions = donation.claim
      ? donation.claim.directionsToReceiver
      : { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
    return {
      distanceMi: (directionsToDonor.distanceMi + directionsToReceiver.distanceMi),
      durationMin: (directionsToDonor.durationMin + directionsToReceiver.durationMin),
      encodedPolyline: this._combineDonationEncodedPolylines(directionsToDonor, directionsToReceiver),
      waypointSegments: directionsToDonor.waypointSegments.concat(directionsToReceiver.waypointSegments)
    };
  }

  /**
   * Combines the encoded polylines contained within the given directions to the donor & receiver.
   * @param directionsToDonor The directions to the donor, which may contain the first encoded polyline that shall be combined.
   * @param directionsToReceiver The directions to the receiver, which may contain the second encoded polyline that shall be combined.
   * @return The combined encoded polyline.
   */
  private _combineDonationEncodedPolylines(directionsToDonor: Directions, directionsToReceiver: Directions): string {
    const encodedPolylines: string[] = [];

    if (directionsToDonor && directionsToDonor.encodedPolyline) {
      encodedPolylines.push(directionsToDonor.encodedPolyline);
    }
    if (directionsToReceiver && directionsToReceiver.encodedPolyline) {
      encodedPolylines.push(directionsToReceiver.encodedPolyline);
    }

    return this._directionsExtractor.combineEncodedPolylines(encodedPolylines);
  }

  /**
   * Gets directions for a given route.
   * @param route The route (waypoints) for which to generate the directions.
   * @return An observable that emits the generated directions.
   */
  genDirections(route: LatLngLiteral[]): Observable<Directions> {
    if (this._directionsCache.hasItem(route)) {
      return of(this._directionsCache.getItem(route));
    }
    
    return this._queryDirections(route).pipe(
      map((directionsResult: DirectionsResult) => {
        const directions: Directions = this._directionsExtractor.extractDirections(<any>directionsResult);
        this._directionsCache.addItem(route, directions); // Make sure we cache the result to reduce number of API calls.
        return directions;
      })
    );
  }

  /**
   * Queries the directions for a given route from a 3rd party service such as Google Maps.
   * @param route The route for which to query the directions.
   * @return An observable that emits the queried raw directions result.
   */
  private _queryDirections(route: LatLngLiteral[]): Observable<DirectionsResult> {
    return new Observable((subscriber: Subscriber<DirectionsResult>) => {
      const request: DirectionsRequest = this._genDirectionsRequest(route);
      this._googleDirections.route(request, (result: DirectionsResult, status: google.maps.DirectionsStatus) => {
        switch (status) {
          case DirectionsStatus.OK:
            subscriber.next(result);
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

  /**
   * Generates a directions query request that is to be sent to a 3rd party service such as Google Maps.
   * @param route The route for which to generate the directions request.
   * @return The directions query request.
   */
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

  /**
   * Converts given directions into renderable map polylines.
   * @param directions The directions that are to be converted to map polylines.
   * @param polylineColors The optional colors of the map polylines. Defaults to DirectionsService.DEFAULT_POLYLINE_COLORS.
   * @return The map polylines.
   */
  directionsToPolylines(directions: Directions, polylineColors: string[] = DirectionsService.DEFAULT_POLYLINE_COLORS): Polyline[] {
    const mapsEncoder = google.maps.geometry.encoding;
    const polylines: Polyline[] = [];
    if (directions.waypointSegments && directions.waypointSegments.length !== 0) {
      directions.waypointSegments.forEach((waypointSeg: WaypointSegment, idx: number) => {
        const path: LatLng[] = (waypointSeg && waypointSeg.encodedPolyline)
          ? mapsEncoder.decodePath(waypointSeg.encodedPolyline)
          : [];
        polylines.push(
          new google.maps.Polyline({ path, strokeColor: polylineColors[idx % polylineColors.length] })
        );
      });
    }
    return polylines;
  }

}

type DirectionsRequest = google.maps.DirectionsRequest;
type DirectionsResult = google.maps.DirectionsResult;
type DirectionsWaypoint = google.maps.DirectionsWaypoint;

const DirectionsStatus = google.maps.DirectionsStatus;
const TravelMode = google.maps.TravelMode;
const UnitSystem = google.maps.UnitSystem;
