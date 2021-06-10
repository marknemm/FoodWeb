import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { HybridDataService } from '~hybrid/hybrid-session/services/hybrid-data/hybrid-data.service';
import { SessionService } from '~web/session/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class HybridLoginGuardService implements CanActivate, CanDeactivate<any> {

  constructor(
    private _hybridData: HybridDataService,
    private _sessionService: SessionService
  ) {}

  /**
   * Determines whether or not the user can enter the bootstrap (login/signup) portion of the app.
   * @return true if the user can enter the bootstrap module, false if not.
   */
  canActivate(): boolean {
    const canActivate: boolean = (!this._sessionService.loggedIn && this._hybridData.isMobileApp);
    if (!canActivate && this._hybridData.isAndroid) {
      // this._appMinimize.minimize();
    }
    return canActivate;
  }

  /**
   * Determines whether or not the user can exit the bootstrap (login/signup) portion of the app.
   * @return true if the user can exit the bootstrap module, false if not.
   */
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    const canDeactivate: boolean = (this._sessionService.loggedIn || nextState.url.indexOf('bootstrap') >= 0);
    if (!canDeactivate && this._hybridData.isAndroid) {
      // this._appMinimize.minimize();
    }
    return canDeactivate;
  }
}
