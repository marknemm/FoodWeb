import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../../../session/services/session/session.service';
import { DeviceInfoService } from '../../../mobile/services/device-info/device-info.service';
import { SplashscreenService } from '../../../mobile/services/splashscreen/splashscreen.service';

@Injectable({
  providedIn: 'root'
})
export class MobileBootGuardService implements CanActivate {

  constructor(
    private _sessionService: SessionService,
    private _deviceInfoService: DeviceInfoService,
    private _splashscreenService: SplashscreenService,
    private _router: Router
  ) {}

  canActivate(): boolean | Observable<boolean> {
    if (!this._deviceInfoService.isMobileApp || this._sessionService.loggedIn) {
      this._splashscreenService.hide();
      return true;
    }

    return this._sessionService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._router.navigate(['/mobile-boot/login']);
        }
        this._splashscreenService.hide();
        return this._sessionService.loggedIn;
      })
    );
  }
}
