import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(
    private _mobileDeviceService: MobileDeviceService,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  /**
   * Determines whether or not the user can enter the bootstrap (login/signup) portion of the app.
   * @return An observable that emits true if the user can enter the bootstrap module, false if not.
   */
  canActivate(): Observable<boolean> {
    return this._mobileDeviceService.connected$.pipe(
      take(1),
      map((connected: boolean) => {
        const activate = (connected && !this._sessionService.loggedIn);
        if (!activate) {
          this._router.navigate(['/', 'home']);
        }
        return activate;
      })
    );
  }

}
