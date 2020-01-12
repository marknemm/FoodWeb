import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';
import { map } from 'rxjs/operators';
import { LatLngLiteral } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class CurrentLocationService {

  private _watchPosition$: Subject<Position> = null;
  private _watchId: number = null;

  constructor() {}

  getCurrentPosition(): Observable<Position> {
    return new Observable((subscriber: Subscriber<Position>) =>
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          subscriber.next(position);
          subscriber.complete();
        },
        (err: PositionError) => subscriber.error(err),
        { enableHighAccuracy: true }
      )
    );
  }

  getCurrentLatLngLiteral(): Observable<LatLngLiteral> {
    return this.getCurrentPosition().pipe(
      map(this._positionToLatLngLiteral)
    );
  }

  watchPosition(): Observable<Position> {
    if (!this._watchPosition$) {
      this._watchPosition$ = new Subject();
      this._watchId = navigator.geolocation.watchPosition(
        (position: Position) => this._watchPosition$.next(position),
        (err: PositionError) => this._watchPosition$.error(err),
        { enableHighAccuracy: true }
      );
    }
    return this._watchPosition$.asObservable();
  }

  watchLatLngLiteral(): Observable<LatLngLiteral> {
    return this.watchPosition().pipe(
      map(this._positionToLatLngLiteral)
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

  private _positionToLatLngLiteral(position: Position): LatLngLiteral {
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }
}
