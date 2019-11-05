import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';  
import { SessionService } from '../../../session/services/session/session.service';
import { AppDataService } from 'src/app/mobile/services/app-data/app-data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRouteGuardService implements CanActivate, CanDeactivate<any> {

  constructor(
    private _appData: AppDataService,
    private _appMinimize: AppMinimize,
    private _sessionService: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const canActivate: boolean = (!this._sessionService.loggedIn && this._appData.isMobileApp);
    if (!canActivate && this._appData.isAndroid) {
      this._appMinimize.minimize();
    }
    return canActivate;
  }

  canDeactivate(component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    const canDeactivate: boolean = (this._sessionService.loggedIn || nextState.url.indexOf('mobile-boot') >= 0) && this._appData.isMobileApp;
    if (!canDeactivate && this._appData.isAndroid) {
      this._appMinimize.minimize();
    }
    return canDeactivate;
  }
}
