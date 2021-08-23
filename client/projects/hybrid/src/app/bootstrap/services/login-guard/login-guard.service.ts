import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { ConnectionStatus, MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';

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
    return this._mobileDeviceService.getConnectionStatus().pipe(
      map((status: ConnectionStatus) => {
        const activate = (status.connected && !this._sessionService.loggedIn);
        if (!activate) {
          this._router.navigate(['/', 'home']);
        }
        return activate;
      })
    );
  }

}
