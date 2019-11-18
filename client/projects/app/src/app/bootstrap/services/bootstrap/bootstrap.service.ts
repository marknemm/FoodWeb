import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppSessionService } from '~app/app-session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService implements CanActivate {

  constructor(
    private _sessionService: AppSessionService,
    private _splashScreen: SplashScreen,
    private _router: Router
  ) {}

  /**
   * Determines whether or not the user can enter the app (activate any non app-bootstrap route).
   * @return true if the user can enter the app, false if not.
   */
  canActivate(): boolean | Observable<boolean> {
    // Check if logged in, meaning we don't need to refresh session status via server request.
    if (this._sessionService.loggedIn) {
      this._splashScreen.hide();
      return true;
    }

    // Contact server via session refresh request to see if user is logged in.
    return this._sessionService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._router.navigate(['/login']);
        }
        this._splashScreen.hide();
        return this._sessionService.loggedIn;
      })
    );
  }
}
