import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactInfo } from '~shared';
import { LatLngLiteral, Waypoint } from '~web/map/map';
import { PositionService } from '~web/map/position/position.service';
import { WaypointService } from '../waypoint/waypoint.service';

@Injectable({
  providedIn: 'root'
})
export class MapAppLinkService {

  constructor(
    private _positionService: PositionService,
    private _waypointService: WaypointService
  ) {}

  genLocationHref(addressInfo: ContactInfo | string): string {
    return (typeof addressInfo === 'string')
      ? `https://maps.google.com/?q=${addressInfo}`
      : `https://maps.google.com/?q=${addressInfo.streetAddress}, ${addressInfo.stateProvince}, ${addressInfo.city}, ${addressInfo.postalCode}`;
  }

  genDirectionHrefEstimate(destination: Waypoint | string): string {
    const daddr: string = this._genUrlAddrArg(destination);
    return `https://www.google.com/maps?saddr=My+Location&daddr=${daddr}`;
  }

  genDirectionHref(destination: Waypoint | string): Observable<string> {
    const daddr: string = this._genUrlAddrArg(destination);
    return this._positionService.refreshCurrentPosition().pipe(
      map((position: LatLngLiteral) => {
        const saddr = `${position.lat},${position.lng}`;
        return `https://www.google.com/maps?saddr=${saddr}&daddr=${daddr}`;
      })
    );
  }

  private _genUrlAddrArg(destination: Waypoint | string): string {
    if (typeof destination === 'string') {
      return destination;
    }
    if ((<ContactInfo>destination).streetAddress) {
      destination = <ContactInfo>destination;
      return `${destination.streetAddress}+${destination.city}+${destination.stateProvince}+${destination.postalCode}`;
    }
    const destinationGPS: LatLngLiteral = this._waypointService.waypointToLatLngLiteral(destination);
    return destinationGPS ? `${destinationGPS.lat},${destinationGPS.lng}` : '';
  }
}
