import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatLngLiteral } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class CurrentLocationService {

  private _watchPosition$: Subject<GeolocationPosition> = null;
  private _watchId: number = null;

  constructor() {}

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((subscriber: Subscriber<GeolocationPosition>) =>
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          subscriber.next(position);
          subscriber.complete();
        },
        (err: GeolocationPositionError) => subscriber.error(err),
        { enableHighAccuracy: true }
      )
    );
  }

  getCurrentLatLngLiteral(): Observable<LatLngLiteral> {
    return this.getCurrentPosition().pipe(
      map(this.positionToLatLngLiteral)
    );
  }

  watchPosition(): Observable<GeolocationPosition> {
    if (!this._watchPosition$) {
      this._watchPosition$ = new Subject();
      this._watchId = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => this._watchPosition$.next(position),
        (err: GeolocationPositionError) => this._watchPosition$.error(err),
        { enableHighAccuracy: true }
      );
    }
    return this._watchPosition$.asObservable();
  }

  watchLatLngLiteral(): Observable<LatLngLiteral> {
    return this.watchPosition().pipe(
      map(this.positionToLatLngLiteral)
    );
  }

  clearWatch(): void {
    if (this._watchPosition$) {
      navigator.geolocation.clearWatch(this._watchId);
      this._watchPosition$.complete();
      this._watchId = null;
      this._watchPosition$ = null;
    }
  }

  positionToLatLngLiteral(position: GeolocationPosition): LatLngLiteral {
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }
}
