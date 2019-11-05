import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../../../session/services/session/session.service';
import { AppDataService } from '../../../mobile/services/app-data/app-data.service';

@Injectable({
  providedIn: 'root'
})
export class MobileBootGuardService implements CanActivate {

  constructor(
    private _sessionService: SessionService,
    private _appDataService: AppDataService,
    private _splashScreen: SplashScreen,
    private _router: Router
  ) {}

  canActivate(): boolean | Observable<boolean> {
    if (!this._appDataService.isMobileApp || this._sessionService.loggedIn) {
      if (this._appDataService.isMobileApp) {
        this._splashScreen.hide();
      }
      return true;
    }

    return this._sessionService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._router.navigate(['/mobile-boot/login']);
        }
        this._splashScreen.hide();
        return this._sessionService.loggedIn;
      })
    );
  }
}
