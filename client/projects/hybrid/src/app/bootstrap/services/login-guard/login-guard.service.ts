import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SessionService } from '~hybrid/session/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate, CanDeactivate<any> {

  constructor(
    private _location: Location,
    private _sessionService: SessionService
  ) {}

  /**
   * Determines whether or not the user can enter the bootstrap (login/signup) portion of the app.
   * @return true if the user can enter the bootstrap module, false if not.
   */
  canActivate(): boolean {
    if (!this._sessionService.loggedIn && Capacitor.getPlatform() === 'android') {
      this._location.back();
    }
    return !this._sessionService.loggedIn;
  }

  /**
   * Determines whether or not the user can exit the bootstrap (login/signup) portion of the app.
   * @return true if the user can exit the bootstrap module, false if not.
   */
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    const canDeactivate: boolean = (this._sessionService.loggedIn || nextState.url.indexOf('bootstrap') >= 0);
    if (!canDeactivate && Capacitor.getPlatform() === 'android') {
      this._location.back();
    }
    return canDeactivate;
  }
}
