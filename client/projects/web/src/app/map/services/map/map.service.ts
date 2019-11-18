import { Injectable } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactInfo, GeographyLocation } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() {}

  refreshCurrentPosition(): Observable<GPSCoordinate> {
    return new Observable<GPSCoordinate>((subscription: Subscriber<GPSCoordinate>) => {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          subscription.next(this._positionToGPSCoordinate(position));
          subscription.complete();
        },
        (error: PositionError) => {
          console.error(error);
          subscription.error(new Error(error.message));
          subscription.complete();
        },
        { enableHighAccuracy: true }
      );
    });
  }

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
    return this.refreshCurrentPosition().pipe(
      map((position: GPSCoordinate) => {
        const saddr = `${position.lat},${position.lon}`;
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
    const destinationGPS: GPSCoordinate = this._waypointToGPSCoordinate(destination);
    return destinationGPS ? `${destinationGPS.lat},${destinationGPS.lon}` : '';
  }

  calcMapCenter(gpsCoordinates: GPSCoordinate[]): GPSCoordinate {
    let latSum: number = 0;
    let lonSum: number = 0;
    gpsCoordinates.forEach((gpsCoordinate: GPSCoordinate) => {
      latSum += gpsCoordinate.lat;
      lonSum += gpsCoordinate.lon;
    });
    return {
      lat: latSum / gpsCoordinates.length,
      lon: lonSum / gpsCoordinates.length
    };
  }

  waypointsToGPSCoordinates(waypoints: Waypoint[]): Observable<GPSCoordinate[]> {
    return new Observable<GPSCoordinate[]>((subscriber: Subscriber<GPSCoordinate[]>) => {
      const gpsCoordinates: GPSCoordinate[] = [];
      let currentPositionIdx: number;
      let currentPosition$: Observable<GPSCoordinate> = of(null);
      if (waypoints) {
        waypoints.forEach((waypoint: Waypoint, idx: number) => {
          if (waypoint === 'My+Location') {
            currentPositionIdx = idx;
            currentPosition$ = this.refreshCurrentPosition();
          } else {
            const gpsCoord: GPSCoordinate = this._waypointToGPSCoordinate(waypoint);
            if (gpsCoord) {
              gpsCoordinates.push(gpsCoord);
            }
          }
        });
      }
      currentPosition$.subscribe((position: GPSCoordinate) => {
        if (position) {
          gpsCoordinates.splice(currentPositionIdx, 0, position);
        }
        subscriber.next(gpsCoordinates);
        subscriber.complete();
      });
    });
  }

  private _waypointToGPSCoordinate(waypoint: Waypoint): GPSCoordinate {
    if ((<Position>waypoint).coords) {
      return this._positionToGPSCoordinate(<Position>waypoint);
    } else if ((<GeographyLocation>waypoint).coordinates) {
      return this._geographyLocationToGPSCoordinate(<GeographyLocation>waypoint);
    } else if ((<ContactInfo>waypoint).location) {
      return this._contactInfoToGPSCoordinate(<ContactInfo>waypoint);
    } else if ((<GPSCoordinate>waypoint).lat) {
      return <GPSCoordinate>waypoint;
    }
    return null;
  }

  private _positionToGPSCoordinate(position: Position): GPSCoordinate {
    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude
    };
  }

  private _geographyLocationToGPSCoordinate(geography: GeographyLocation): GPSCoordinate {
    return {
      lat: geography.coordinates[1],
      lon: geography.coordinates[0]
    };
  }

  private _contactInfoToGPSCoordinate(contactInfo: ContactInfo): GPSCoordinate {
    return this._geographyLocationToGPSCoordinate(contactInfo.location);
  }
}

export interface GPSCoordinate {
  lat: number;
  lon: number;
}

export type Waypoint = 'My+Location' | Position | GeographyLocation | GPSCoordinate | ContactInfo;
