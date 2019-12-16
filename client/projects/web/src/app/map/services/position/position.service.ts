import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { LatLngLiteral } from '~web/map/map';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor() {}

  refreshCurrentPosition(): Observable<LatLngLiteral> {
    return new Observable<LatLngLiteral>((subscription: Subscriber<LatLngLiteral>) => {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          subscription.next(this.positionToLatLngLiteral(position));
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

  positionToLatLngLiteral(position: Position): LatLngLiteral {
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  }
}
