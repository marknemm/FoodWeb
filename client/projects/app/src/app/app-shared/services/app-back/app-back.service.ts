import { Injectable, NgZone } from '@angular/core';
import { AndroidActivityBackPressedEventData, AndroidApplication, Application, isAndroid } from '@nativescript/core';
import { AndroidActivityEventData } from '@nativescript/core/application/application-interfaces';
import { Observable, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppBackService {

  disableBack = false;

  private _androidBack$ = new Subject<AndroidActivityBackPressedEventData>();

  constructor(
    private _zone: NgZone
  ) {
    this._registerAndroidBackListener();
  }

  get androidBack$(): Observable<AndroidActivityBackPressedEventData> {
    return this._androidBack$.asObservable();
  }

  disableBackUntil(obs$: Observable<any>): void {
    this.disableBack = true;
    obs$.pipe(take(1)).subscribe(
      () => this.disableBack = false
    );
  }

  overrideBackUntil(obs$: Observable<any>): Observable<AndroidActivityBackPressedEventData> {
    this.disableBack = true;
    return this.androidBack$.pipe(
      takeUntil(obs$),
      finalize(() => this.disableBack = false)
    );
  }

  private _registerAndroidBackListener(): void {
    if (isAndroid) {
      Application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityEventData) => {
        if (this.disableBack) {
          (<AndroidActivityBackPressedEventData>data).cancel = true;
        }
        this._zone.run(() => // Must run in NgZone so that certain operations do not fail in subscriber (e.g. manual routing).
          this._androidBack$.next(<AndroidActivityBackPressedEventData>data)
        );
      });
    }
  }
}
