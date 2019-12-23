import { Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Donation } from '~shared';
import { DirectionsService } from '~web/map/directions/directions.service';
import { ClientWaypoint, Directions, LatLng, LatLngBounds, LatLngLiteral, MapOptions, Polyline } from '~web/map/map';
import { WaypointService } from '~web/map/waypoint/waypoint.service';
export * from '~web/map/map';

@Injectable()
export class MapService {

  private _directions: Directions = null;
  private _latLngWaypoints: LatLngLiteral[] = [];
  private _mapBounds = new google.maps.LatLngBounds();
  private _mapCenter: LatLng = new google.maps.LatLng(0, 0);
  private _polylines: Polyline[] = [];

  constructor(
    private _waypointService: WaypointService,
    private _directionsService: DirectionsService
  ) {}

  /**
   * The map direcitons.
   */
  get directions(): Directions {
    return this._directions;
  }

  /**
   * The map GPS (lat-lng) coordinate waypoints.
   */
  get latLngWaypoints(): LatLngLiteral[] {
    return this._latLngWaypoints;
  }

  /**
   * The map (lat-lng) viewport bounds.
   */
  get mapBounds(): LatLngBounds {
    return this._mapBounds;
  }

  /**
   * The map GPS (lat-lng) coordinate viewport center.
   */
  get mapCenter(): LatLng {
    return this._mapCenter;
  }

  /**
   * The renderable map directions polylines.
   */
  get polylines(): Polyline[] {
    return this._polylines;
  }

  /**
   * Refreshes a map's data & attributes based on a given donation.
   * @param map The map HTML element that is to be refreshed.
   * @param donation The donation used to refresh the map data/attributes.
   * @param options Delivery map options.
   */
  refreshMap(map: GoogleMap, donation: Donation, options: MapOptions): void {
    this._clearMapData();
    const donationWaypoints: ClientWaypoint[] = this._waypointService.extractDonationWaypoints(donation, options.useVolunteerCurrentPos);
    this._refreshLatLngWaypoints(donationWaypoints).subscribe((latLngWaypoints: LatLngLiteral[]) => {
      this._refreshMapView(map, latLngWaypoints);
      this._refreshDirections(map, donation, latLngWaypoints, options);
    });
  }

  /**
   * Clears all map data (waypoints, directions, etc).
   */
  private _clearMapData(): void {
    this._latLngWaypoints = [];
    this.polylines.forEach((polyline: Polyline) =>
      polyline.setMap(null)
    );
    this._polylines = [];
    this._directions = null;
  }

  /**
   * Refreshes the GPS (lat-lng) coordinate waypoints for the associated map.
   * @param waypoints The (client) waypoints that are to be transformed into map GPS (lat-lng) coordinate waypoints.
   * @return An observable that emits the new GPS (lat-lng) coordinate waypoints.
   */
  private _refreshLatLngWaypoints(waypoints: ClientWaypoint[]): Observable<LatLngLiteral[]> {
    return this._waypointService.waypointsToLatLngLiterals(waypoints).pipe(
      map((latLngLiterals: LatLngLiteral[]) => this._latLngWaypoints = latLngLiterals)
    );
  }

  /**
   * Refreshes the attributes for the map viewport (bounds & center).
   * @param map The map for which we are refreshing the viewport attributes.
   * @param latLngWaypoints The map waypoints that must be fit within the viewport.
   */
  private _refreshMapView(map: GoogleMap, latLngWaypoints: LatLngLiteral[]): void {
    if (latLngWaypoints.length) {
      this._mapBounds = this._calcMapBounds(latLngWaypoints);
      this._mapCenter = this._mapBounds.getCenter();
      map.fitBounds(this._mapBounds);
    }
  }

  /**
   * Calculates the map viewport bounds that will fit a given set of map GPS (lat-lng) coordinate waypoints.
   * @param latLngWaypoints The map waypoints that must be fit within the viewport.
   * @return The calculated map viewport bounds.
   */
  private _calcMapBounds(latLngWaypoints: LatLngLiteral[]): LatLngBounds {
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

  /**
   * Refeshes the directions.
   * @param map The map for which we are refreshing directions.
   * @param donation The donation that the directions are for.
   * @param latLngWaypoints The computed GPS (lat-lng) waypoints that the directions are for. If useVolunteerCurrentPos is true,
   * then the first (volunteer) waypoint will be the current position of the volunteer user. Otherwise, these waypoints align with the
   * pre-recorded addresses within the accounts associated with the given donation.
   * @param options The map (direction) options.
   */
  private _refreshDirections(map: GoogleMap, donation: Donation, latLngWaypoints: LatLngLiteral[], options: MapOptions): void {
    if (!options.useVolunteerCurrentPos) {
      const directions: Directions = this._directionsService.extractDirectionsFromDonation(donation);
      this._setDirections(map, directions, options);
    } else if (latLngWaypoints.length > 1) {
      this._directionsService.genDirections(latLngWaypoints).subscribe(
        (directions: Directions) => this._setDirections(map, directions, options)
      );
    }
  }

  /**
   * Sets the directions data values for a given map.
   * @param map The map for which to set the directions.
   * @param directions The directions to set.
   * @param options The map (direction) options.
   */
  private _setDirections(map: GoogleMap, directions: Directions, options: MapOptions): void {
    this._directions = directions;
    this._polylines = this._directionsService.directionsToPolylines(directions);
    this.polylines.forEach((polyline: Polyline, idx: number) => {
      if ((options.displayRouteToDonor && idx === 0) || (options.displayRouteToReceiver && idx === 1) || idx > 1) {
        polyline.setMap(map._googleMap);
      }
    });
  }
}
