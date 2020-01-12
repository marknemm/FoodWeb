import { Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, Donation } from '~shared';
import { DirectionsService } from '~web/map/directions/directions.service';
import { Directions, LatLng, LatLngBounds, LatLngLiteral, MapOptions, Polyline, WaypointMarker } from '~web/map/map';
import { WaypointService, VolunteerWaypointConfig } from '~web/map/waypoint/waypoint.service';
import { SessionService } from '~web/session/services/session/session.service';
import { MapAppLinkService } from '../map-app-link/map-app-link.service';
import { MapViewportService } from '../map-viewport/map-viewport.service';
export * from '~web/map/map';

@Injectable()
export class MapService {

  private _directions: Directions = null;
  private _directionsHref = '';
  private _latLngWaypoints: LatLngLiteral[] = [];
  private _mapBounds = new google.maps.LatLngBounds();
  private _mapCenter: LatLng = new google.maps.LatLng(0, 0);
  private _polylines: Polyline[] = [];
  private _waypointMarkers: WaypointMarker[] = [];

  constructor(
    private _directionsService: DirectionsService,
    private _mapAppLinkService: MapAppLinkService,
    private _mapViewportService: MapViewportService,
    private _sessionService: SessionService,
    private _waypointService: WaypointService
  ) {}

  /**
   * The map direcitons.
   */
  get directions(): Directions {
    return this._directions;
  }

  /**
   * The map directions href for a 3rd party map navigation app/website.
   */
  get directionsHref(): string {
    return this._directionsHref;
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
   * The data that represents map waypoint markers.
   */
  get waypointMarkers(): WaypointMarker[] {
    return this._waypointMarkers;
  }

  /**
   * Refreshes a map's data & attributes based on a given donation.
   * @param map The map HTML element that is to be refreshed.
   * @param donation The donation used to refresh the map data/attributes.
   * @param options Delivery map options.
   */
  refreshMap(map: GoogleMap, donation: Donation, options: MapOptions): void {
    this._clearMapData();
    this._refreshWaypoints(donation, options).subscribe(() => {
      this._refreshDirectionsHref();
      this._refreshMapView(map);
      this._refreshDirections(map, donation, options);
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
    this._directionsHref = '';
  }

  /**
   * Refreshes the GPS (lat-lng) coordinate waypoints for the associated map.
   * @param donation The donation used to refresh to map waypoints.
   * @param options The map options.
   * @return An observable that emits once the waypoints are refreshed.
   */
  private _refreshWaypoints(donation: Donation, options: MapOptions): Observable<void> {
    const potentialVolunteer: Account = ((!donation.claim || !donation.claim.delivery) && this._sessionService.isVolunteer)
      ? this._sessionService.account
      : null;
    const volunteerWaypointConfig: VolunteerWaypointConfig = this._genVolunteerWaypointConfig(donation, options);

    return this._waypointService.extractWaypoints(donation, potentialVolunteer, volunteerWaypointConfig).pipe(
      map((waypointMarkers: WaypointMarker[]) => {
        this._waypointMarkers = waypointMarkers;
        this._latLngWaypoints = this.waypointMarkers.map((marker: WaypointMarker) => marker.latLng);
      })
    );
  }

  /**
   * Generates the volunteer waypoint config for the contianing map based off of the associated donation and map options.
   * @param donation The donation from which the waypoints are generated.
   * @param options The map options.
   * @return The volunteer waypoint config.
   */
  private _genVolunteerWaypointConfig(donation: Donation, options: MapOptions): VolunteerWaypointConfig {
    let volunteerWaypointConfig = VolunteerWaypointConfig.Home;
    // Exlcude the volunteer waypoint for users who are viewing a scheduled delivery which are not the volunteer.
    if (donation.claim && donation.claim.delivery && !this._sessionService.isMyAccount(donation.claim.delivery.volunteerAccount.id)) {
      volunteerWaypointConfig = VolunteerWaypointConfig.Exclude;
    } else if (options.useVolunteerCurrentPos) {
      volunteerWaypointConfig = VolunteerWaypointConfig.CurrentPosition;
    }
    return volunteerWaypointConfig;
  }

  /**
   * Refreshes the navigation directions href for the associated map.
   */
  private _refreshDirectionsHref(): void {
    this._directionsHref = this._mapAppLinkService.genDirectionHref(
      this.waypointMarkers.map((marker: WaypointMarker) => marker.latLngSrc)
    );
  }

  /**
   * Refreshes the attributes for the map viewport (bounds & center).
   * @param map The map for which we are refreshing the viewport attributes.
   */
  private _refreshMapView(map: GoogleMap): void {
    if (this.latLngWaypoints.length) {
      this._mapBounds = this._mapViewportService.calcMapBounds(this.latLngWaypoints);
      this._mapCenter = this._mapBounds.getCenter();
      map.fitBounds(this._mapBounds);
    }
  }

  /**
   * Refeshes the directions.
   * @param map The map for which we are refreshing directions.
   * @param donation The donation that the directions are for.
   * @param options The map (direction) options.
   */
  private _refreshDirections(map: GoogleMap, donation: Donation, options: MapOptions): void {
    if (!options.useVolunteerCurrentPos) {
      const directions: Directions = this._directionsService.extractDirectionsFromDonation(donation);
      this._setDirections(map, directions, options);
    } else if (this.latLngWaypoints.length > 1) {
      this._directionsService.genDirections(this.latLngWaypoints).subscribe(
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
