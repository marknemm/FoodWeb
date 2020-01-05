import { Injectable } from '@angular/core';
import { ContactInfo, MapWaypointConverter } from '~shared';
import { ClientWaypoint, LatLngLiteral, Waypoint } from '~web/map/map';

@Injectable({
  providedIn: 'root'
})
export class MapAppLinkService {

  constructor(
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
   * Generates a map directions href (to a 3rd party map service) based off of a given set of path waypoints.
   * @param waypoints The path waypoints for which the directions href will be generated.
   * @return An observable that emits the map directions href.
   */
  genDirectionHref(waypoints: (ClientWaypoint | string)[]): string {
    const saddr: string = 'My+Location';
    const waddrs: string[] = waypoints.slice(1, waypoints.length -1).map(
      (waypoint: ClientWaypoint) => this._genUrlAddrArg(waypoint)
    );
    const daddr: string = this._genUrlAddrArg(waypoints[waypoints.length - 1]);
    return `https://www.google.com/maps/dir/?api=1&origin=${saddr}&destination=${daddr}`
      + (waddrs.length ? `&waypoints=${waddrs.join('|')}` : '');
  }

  /**
   * Converts a given waypoint to a URL address argument.
   * @param waypoint The waypoint form which to generate the URL address argument.
   * @return The URL address argument.
   */
  private _genUrlAddrArg(waypoint: ClientWaypoint | string): string {
    if (typeof waypoint === 'string') {
      return waypoint;
    }
    if ((<ContactInfo>waypoint).streetAddress) {
      waypoint = <ContactInfo>waypoint;
      return `${waypoint.streetAddress}+${waypoint.city}+${waypoint.stateProvince}+${waypoint.postalCode}`;
    }
    const waypointGPS: LatLngLiteral = this._mapWaypointConverter.waypointToLatLngLiteral(<Waypoint>waypoint);
    return waypointGPS ? `${waypointGPS.lat},${waypointGPS.lng}` : '';
  }
}
