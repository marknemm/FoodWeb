import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactInfo, MapWaypointConverter } from '~shared';
import { LatLngLiteral, Waypoint } from '~web/map/map';
import { PositionService } from '~web/map/position/position.service';

@Injectable({
  providedIn: 'root'
})
export class MapAppLinkService {

  constructor(
    private _positionService: PositionService,
    private _mapWaypointConverter: MapWaypointConverter
  ) {}

  /**
   * Generates a map location href (to a 3rd party map service) from given address info.
   * @param addressInfo The address/contact info from which to generate the map location href.
   * @return The map location href.
   */
  genLocationHref(addressInfo: ContactInfo | string): string {
    return (typeof addressInfo === 'string')
      ? `https://maps.google.com/?q=${addressInfo}`
      : `https://maps.google.com/?q=${addressInfo.streetAddress}, ${addressInfo.stateProvince}, ${addressInfo.city}, ${addressInfo.postalCode}`;
  }

  /**
   * Generates a map directions href (to a 3rd party map service) from the user's current location to a given destination waypoint.
   * This serves as a temporary estimate that will return immediately. This should be followed by a call to 'genDirectionsHref' which is async.
   * @param destination The destination waypoint from which to generate the map directions href.
   * @return The map directions href.
   */
  genDirectionHrefEstimate(destination: Waypoint | string): string {
    const daddr: string = this._genUrlAddrArg(destination);
    return `https://www.google.com/maps?saddr=My+Location&daddr=${daddr}`;
  }

  /**
   * Generates a map directions href (to a 3rd party map service) from the user's current location to a given destination waypoint.
   * @param destination The destination waypoint from which to generate the map directions href.
   * @return An observable that emits the map directions href.
   */
  genDirectionHref(destination: Waypoint | string): Observable<string> {
    const daddr: string = this._genUrlAddrArg(destination);
    return this._positionService.refreshCurrentPosition().pipe(
      map((position: LatLngLiteral) => {
        const saddr = `${position.lat},${position.lng}`;
        return `https://www.google.com/maps?saddr=${saddr}&daddr=${daddr}`;
      })
    );
  }

  /**
   * Converts a given waypoint to a URL address argument.
   * @param waypoint The waypoint form which to generate the URL address argument.
   * @return The URL address argument.
   */
  private _genUrlAddrArg(waypoint: Waypoint | string): string {
    if (typeof waypoint === 'string') {
      return waypoint;
    }
    if ((<ContactInfo>waypoint).streetAddress) {
      waypoint = <ContactInfo>waypoint;
      return `${waypoint.streetAddress}+${waypoint.city}+${waypoint.stateProvince}+${waypoint.postalCode}`;
    }
    const waypointGPS: LatLngLiteral = this._mapWaypointConverter.waypointToLatLngLiteral(waypoint);
    return waypointGPS ? `${waypointGPS.lat},${waypointGPS.lng}` : '';
  }
}
