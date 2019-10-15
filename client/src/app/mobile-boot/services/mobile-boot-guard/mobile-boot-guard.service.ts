import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../../../session/services/session/session.service';
import { DeviceInfoService } from '../device-info/device-info.service';

@Injectable({
  providedIn: 'root'
})
export class MobileBootGuardService implements CanActivate {
  
  constructor(
    private _sessionService: SessionService,
    private _deviceInfoService: DeviceInfoService,
    private _router: Router
  ) {}

  canActivate(): boolean {
    const canActivate: boolean = (!this._deviceInfoService.isMobileApplication || this._sessionService.loggedIn);
    if (!canActivate) {
      this._router.navigate(['/mobile-boot/login']);
    }
    return canActivate;
  }
}
