import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatLngLiteral } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class CurrentLocationService {

  protected _watchPosition$: Subject<GeolocationPosition> = null;
  protected _watchId: string = null;

  getCurrentPosition(): Observable<GeolocationPosition> {
    return from(Geolocation.getCurrentPosition({ enableHighAccuracy: true }));
  }

  getCurrentLatLngLiteral(): Observable<LatLngLiteral> {
    return this.getCurrentPosition().pipe(
      map(this.positionToLatLngLiteral)
    );
  }

  watchPosition(): Observable<GeolocationPosition> {
    if (!this._watchPosition$) {
      this._watchPosition$ = new Subject();
      Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position: GeolocationPosition) => this._watchPosition$.next(position)
      )
      .then((id: string) => this._watchId = id)
      .catch((err: Error) => this._watchPosition$.error(err));
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
      Geolocation.clearWatch({ id: this._watchId });
      this._watchPosition$.complete();
      this._watchId = null;
      this._watchPosition$ = null;
    }
  }

  positionToLatLngLiteral(position: GeolocationPosition): LatLngLiteral {
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }
}
