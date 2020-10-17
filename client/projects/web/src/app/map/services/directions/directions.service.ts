import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, DirectionsExtractor, Donation, MapRoute, MapRouteReadRequest, WaypointSegment } from '~shared';
import { environment } from '~web-env/environment';
import { Directions, LatLng, LatLngLiteral, MapOptions, Polyline, Waypoint } from '~web/map/interfaces/map';
import { LocalStorageBucket, LocalStorageCacheService } from '~web/shared/services/local-storage-cache/local-storage-cache.service';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  static readonly DEFAULT_POLYLINE_COLORS: string[] = ['green', 'rgb(247, 148, 7)', 'blue', 'purple', 'cyan', 'red'];
  private static readonly DIRECTIONS_CACHE_KEY = 'foodwebDirectionsStore';

  readonly url = `${environment.server}/map`;
  private readonly _directionsCache: LocalStorageBucket<Waypoint[], Directions>;
  private readonly _googleDirections = new google.maps.DirectionsService();

  constructor(
    private _directionsExtractor: DirectionsExtractor,
    private _httpClient: HttpClient,
    localStorageCacheService: LocalStorageCacheService
  ) {
    this._directionsCache = localStorageCacheService.getBucket(DirectionsService.DIRECTIONS_CACHE_KEY);
  }

  /**
   * Extracts a set of directions from a given donation.
   * @param donation The donation from which to extract directions from.
   * @param potentialVolunteer The potential volunteer (current user) for the donation.
   * NOTE: Should only be non-null if the given donation does not have a scheduled delivery and the current user is a 'Volunteer'.
   * @return The extracted donation directions.
   */
  extractDirectionsFromDonation(donation: Donation, potentialVolunteer: Account): Observable<Directions> {
    const directionsToDonor$: Observable<Directions> = this._getDirectionsToDonor(donation, potentialVolunteer);
    const directionsToReceiver: Directions = this._getDirectionsToReceiver(donation);

    return directionsToDonor$.pipe(
      map((directionsToDonor: Directions) => ({
        distanceMi: (directionsToDonor.distanceMi + directionsToReceiver.distanceMi),
        durationMin: (directionsToDonor.durationMin + directionsToReceiver.durationMin),
        encodedPolyline: this._combineDonationEncodedPolylines(directionsToDonor, directionsToReceiver),
        waypointSegments: directionsToDonor.waypointSegments.concat(directionsToReceiver.waypointSegments)
      }))
    );
  }

  /**
   * Gets the directions from either a volunteer within a given donation or a potential volunteer
   * (the current user) to the donor within a given donation.
   * @param donation The donation from which to extract the directions (from volunteer) to donor.
   * @param potentialVolunteer An observable that emits:
   * The potential volunteer (current user) that will be non-null if the given
   * donation does not have a volunteer yet, and the current user is a volunteer.
   */
  private _getDirectionsToDonor(donation: Donation, potentialVolunteer: Account): Observable<Directions> {
    if (donation.claim && donation.claim.delivery) {
      return of(donation.claim.delivery.routeToDonor.directions);
    } else if (!potentialVolunteer) {
      return of({ distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] });
    }

    const donorCoords: [number, number] = donation.donorContactOverride.location.coordinates;
    const volunteerCoords: [number, number] = potentialVolunteer.contactInfo.location.coordinates;
    const request: MapRouteReadRequest = {
      origLat: `${volunteerCoords[1]}`,
      origLng: `${volunteerCoords[0]}`,
      destLat: `${donorCoords[1]}`,
      destLng: `${donorCoords[0]}`
    };

    const params = new HttpParams({ fromObject: <any>request });
    return this._httpClient.get<MapRoute>(
      `${this.url}/route`, { params, withCredentials: true }
    ).pipe(
      map((mapRoute: MapRoute) => mapRoute.directions)
    );
  }

  /**
   * Gets the directions from a receiver within a given donation to a donor within a given donation.
   * @param donation The donation from which to extract the directions (from donor) to receiver.
   * @return The directions that were extracted from the donation.
   */
  private _getDirectionsToReceiver(donation: Donation): Directions {
    return (donation.claim)
      ? donation.claim.routeToReceiver.directions
      : { distanceMi: 0, durationMin: 0, encodedPolyline: '', waypointSegments: [] };
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
   * @return The map polylines.
   */
  directionsToPolylines(directions: Directions, options: MapOptions): DirectionPolylines {
    const polylineColors = DirectionsService.DEFAULT_POLYLINE_COLORS;
    const mapsEncoder = google.maps.geometry.encoding;
    const directionPolylines: DirectionPolylines = { polylines: [], mapPolylines: [] };

    if (directions.waypointSegments && directions.waypointSegments.length !== 0) {
      directions.waypointSegments.forEach((waypointSeg: WaypointSegment, idx: number) => {
        const path: LatLng[] = (waypointSeg && waypointSeg.encodedPolyline)
          ? mapsEncoder.decodePath(waypointSeg.encodedPolyline)
          : [];
        const strokeColor: string = polylineColors[idx % polylineColors.length];
        const polyline = new google.maps.Polyline({ path, strokeColor });
        directionPolylines.polylines.push(polyline);
        if (this._shouldDisplayPolyline(options, directions.waypointSegments.length, idx)) {
          directionPolylines.mapPolylines.push(
            { path, options: { strokeColor } }
          );
        }
      });
    }

    return directionPolylines;
  }

  /**
   * Determines if a polyline described by a given index should be displayed based off of given map options.
   * @param options The map options including config for route polyline display.
   * @param polylineCnt The total number of polylines that can be displayed.
   * @param idx The (0 based) index of the polyline.
   * @return true if the route polyline should be displayed, false if not.
   */
  private _shouldDisplayPolyline(options: MapOptions, polylineCnt: number, idx: number): boolean {
    return (polylineCnt === 2)
      ? (idx !== 0 || options.displayRouteToDonor) && (idx !== 1 || options.displayRouteToReceiver)
      : options.displayRouteToReceiver;
  }

}

export interface DirectionPolylines {
  polylines: Polyline[];
  mapPolylines: RenderPolyline[];
}

export interface RenderPolyline {
  path: google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[];
  options: google.maps.PolylineOptions;
}

type DirectionsRequest = google.maps.DirectionsRequest;
type DirectionsResult = google.maps.DirectionsResult;
type DirectionsWaypoint = google.maps.DirectionsWaypoint;

const DirectionsStatus = google.maps.DirectionsStatus;
const TravelMode = google.maps.TravelMode;
const UnitSystem = google.maps.UnitSystem;
