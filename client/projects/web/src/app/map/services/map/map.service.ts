import { Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, Donation } from '~shared';
import { Directions, LatLng, LatLngBounds, LatLngLiteral, MapOptions, WaypointMarker } from '~web/map/interfaces/map';
import { DirectionPolylines, DirectionsService, RenderPolyline } from '~web/map/services/directions/directions.service';
import { MapAppLinkService } from '~web/map/services/map-app-link/map-app-link.service';
import { MapViewportService } from '~web/map/services/map-viewport/map-viewport.service';
import { VolunteerWaypointConfig, WaypointService } from '~web/map/services/waypoint/waypoint.service';
import { SessionService } from '~web/session/services/session/session.service';
export * from '~web/map/interfaces/map';

@Injectable()
export class MapService {

  private _directions: Directions = null;
  private _directionsHref = '';
  private _latLngWaypoints: LatLngLiteral[] = [];
  private _mapBounds = new google.maps.LatLngBounds();
  private _mapCenter: LatLng = new google.maps.LatLng(0, 0);
  private _directionPolylines: DirectionPolylines = { polylines: [], mapPolylines: [] };
  private _waypointMarkers: WaypointMarker[] = [];

  constructor(
    private _directionsService: DirectionsService,
    private _mapAppLinkService: MapAppLinkService,
    private _mapViewportService: MapViewportService,
    private _sessionService: SessionService,
    private _waypointService: WaypointService
  ) {}

  /**
   * The map directions.
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
  get mapPolylines(): RenderPolyline[] {
    return this._directionPolylines.mapPolylines;
  }

  /**
   * The data that represents map waypoint markers.
   */
  get waypointMarkers(): WaypointMarker[] {
    return this._waypointMarkers;
  }

  /**
   * Refreshes a map's data & attributes based on a given donation.
   * @param googleMap The map HTML element that is to be refreshed.
   * @param donation The donation used to refresh the map data/attributes.
   * @param options Delivery map options.
   */
  refreshMap(googleMap: GoogleMap, donation: Donation, options: MapOptions): void {
    this._clearMapData();
    this._refreshWaypoints(donation, options).subscribe(() => {
      this._refreshDirectionsHref(donation);
      this._refreshMapView(googleMap);
      this._refreshDirections(donation, options);
    });
  }

  /**
   * Clears all map data (waypoints, directions, etc).
   */
  private _clearMapData(): void {
    this._latLngWaypoints = [];
    this._directionPolylines = { polylines: [], mapPolylines: [] };
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
    const potentialVolunteer: Account = this._getPotentialVolunteer(donation);
    const volunteerWaypointConfig: VolunteerWaypointConfig = this._genVolunteerWaypointConfig(donation, options);

    return this._waypointService.extractWaypoints(donation, potentialVolunteer, volunteerWaypointConfig).pipe(
      map((waypointMarkers: WaypointMarker[]) => {
        this._waypointMarkers = waypointMarkers;
        this._latLngWaypoints = this.waypointMarkers.map((marker: WaypointMarker) => marker.latLng);
      })
    );
  }

  /**
   * Gets a potential volunteer for a given donation. The given donation can only have a potential volunteer if
   * it has been claimed but not scheduled for delivery. The potential volunteer will be set to the current user's account
   * if their account type is 'Volunteer'.
   * @param donation The donation for which to get the potential volunteer.
   * @return The potential volunteer account if there is one. If one doesn't exist for the given donation, then null.
   */
  private _getPotentialVolunteer(donation: Donation): Account {
    return (!donation.claim?.delivery && this._sessionService.isVolunteer)
      ? this._sessionService.account
      : null;
  }

  /**
   * Generates the volunteer waypoint config for the containing map based off of the associated donation and map options.
   * @param donation The donation from which the waypoints are generated.
   * @param options The map options.
   * @return The volunteer waypoint config.
   */
  private _genVolunteerWaypointConfig(donation: Donation, options: MapOptions): VolunteerWaypointConfig {
    let volunteerWaypointConfig = VolunteerWaypointConfig.Home;
    // Exclude the volunteer waypoint for users who are viewing a scheduled delivery which are not the volunteer.
    if (donation.claim && donation.claim.delivery && !this._sessionService.hasAccountOwnership(donation.claim.delivery.volunteerAccount.id)) {
      volunteerWaypointConfig = VolunteerWaypointConfig.Exclude;
    } else if (options.useVolunteerCurrentPos) {
      volunteerWaypointConfig = VolunteerWaypointConfig.CurrentPosition;
    }
    return volunteerWaypointConfig;
  }

  /**
   * Refreshes the navigation directions href for the associated map.
   */
  private _refreshDirectionsHref(donation: Donation): void {
    this._directionsHref = this._mapAppLinkService.genDirectionHref(
      this.waypointMarkers.map((marker: WaypointMarker) => marker.latLngSrc),
      donation
    );
  }

  /**
   * Refreshes the attributes for the map viewport (bounds & center).
   * @param map The map for which we are refreshing the viewport attributes.
   */
  private _refreshMapView(googleMap: GoogleMap): void {
    if (this.latLngWaypoints.length) {
      this._mapBounds = this._mapViewportService.calcMapBounds(this.latLngWaypoints);
      this._mapCenter = this._mapBounds.getCenter();
      googleMap.fitBounds(this._mapBounds);
    }
  }

  /**
   * Refreshes the directions.
   * @param donation The donation that the directions are for.
   * @param options The map (direction) options.
   */
  private _refreshDirections(donation: Donation, options: MapOptions): void {
    let directions$: Observable<Directions>;

    if (!options.useVolunteerCurrentPos) {
      const potentialVolunteer = this._getPotentialVolunteer(donation);
      directions$ = this._directionsService.extractDirectionsFromDonation(donation, potentialVolunteer);
    } else if (this.latLngWaypoints.length > 1) {
      directions$ = this._directionsService.genDirections(this.latLngWaypoints);
    }

    directions$?.subscribe((directions: Directions) => {
      this._directions = directions;
      this._directionPolylines = this._directionsService.directionsToPolylines(directions, options);
    });
  }
}
