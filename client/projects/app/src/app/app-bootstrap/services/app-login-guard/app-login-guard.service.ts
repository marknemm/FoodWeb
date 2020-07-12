import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AppDataService } from '~app/app-session/app-data/app-data.service';
import { AppSessionService } from '~app/app-session/app-session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoginGuardService implements CanActivate, CanDeactivate<any> {

  constructor(
    private _appData: AppDataService,
    private _appMinimize: AppMinimize,
    private _sessionService: AppSessionService
  ) {}

  /**
   * Determines whether or not the user can enter the bootstrap (login/signup) portion of the app.
   * @return true if the user can enter the bootstrap module, false if not.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const canActivate: boolean = (!this._sessionService.loggedIn && this._appData.isMobileApp);
    if (!canActivate && this._appData.isAndroid) {
      this._appMinimize.minimize();
    }
    return canActivate;
  }

  /**
   * Determines whether or not the user can exit the bootstrap (login/signup) portion of the app.
   * @return true if the user can exit the bootstrap module, false if not.
   */
  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    const canDeactivate: boolean = (this._sessionService.loggedIn || nextState.url.indexOf('bootstrap') >= 0);
    if (!canDeactivate && this._appData.isAndroid) {
      this._appMinimize.minimize();
    }
    return canDeactivate;
  }
}
