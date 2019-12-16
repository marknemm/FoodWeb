import { Injectable } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectionsService } from '~web/map/directions/directions.service';
import { Directions, LatLng, LatLngBounds, LatLngLiteral, Polyline, Waypoint } from '~web/map/map';
import { WaypointService } from '~web/map/waypoint/waypoint.service';
export * from '~web/map/map';

@Injectable()
export class MapService {

  private _direcitons$ = new Subject<Directions>();
  private _latLngWaypoints: LatLngLiteral[] = [];
  private _mapCenter: LatLng = new google.maps.LatLng(0, 0);
  private _mapBounds = new google.maps.LatLngBounds();

  constructor(
    private _waypointService: WaypointService,
    private _directionsService: DirectionsService
  ) {}

  get directions$(): Observable<Directions> {
    return this._direcitons$.asObservable();
  }

  get latLngWaypoints(): LatLngLiteral[] {
    return this._latLngWaypoints;
  }

  get mapBounds(): LatLngBounds {
    return this._mapBounds;
  }

  get mapCenter(): LatLng {
    return this._mapCenter;
  }

  refreshMap(map: GoogleMap, waypoints: Waypoint | Waypoint[], calcDirections = false): void {
    this._refreshLatLngWaypoints(waypoints).subscribe((latLngWaypoints: LatLngLiteral[]) => {
      this._refreshMapView(map, latLngWaypoints);
      this._refreshDirections(map, calcDirections);
    });
  }

  private _refreshLatLngWaypoints(waypoints: Waypoint | Waypoint[]): Observable<LatLngLiteral[]> {
    waypoints = (!waypoints || waypoints instanceof Array) ? waypoints : [waypoints];
    return this._waypointService.waypointsToLatLngLiterals(<Waypoint[]>waypoints).pipe(
      map((latLngLiterals: LatLngLiteral[]) => this._latLngWaypoints = latLngLiterals)
    );
  }

  private _refreshMapView(map: GoogleMap, latLngLiterals: LatLngLiteral[]): void {
    if (this.latLngWaypoints.length) {
      this._mapBounds = this._calcMapBounds(latLngLiterals);
      this._mapCenter = this._mapBounds.getCenter();
      map.fitBounds(this._mapBounds);
    }
  }

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

  private _refreshDirections(map: GoogleMap, calcDirections: boolean): void {
    if (calcDirections && this.latLngWaypoints.length > 1) {
      this._directionsService.getDirections(this.latLngWaypoints).subscribe(
        (directions: Directions) => {
          directions.polylines.forEach((polyline: Polyline) =>
            polyline.setMap(map._googleMap)
          );
          this._direcitons$.next(directions);
        }
      );
    }
  }
}
