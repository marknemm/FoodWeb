import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { map } from 'rxjs/operators';
import { AppSessionService } from '~app/app-session/app-session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class AppBootstrapService implements CanActivate {

  constructor(
    private _sessionService: AppSessionService,
    private _splashScreen: SplashScreen,
    private _router: Router
  ) {}

  /**
   * Determines whether or not the user can enter the app (activate any non app-bootstrap route).
   * @return A promise that resolves to true if the user can enter the app, false if not.
   */
  canActivate(): Promise<boolean> {
    // Contact server via session refresh request to see if user is logged in.
    return this._sessionService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._router.navigate(['/login']);
        }
        setTimeout(() => this._splashScreen.hide());
        return this._sessionService.loggedIn;
      })
    ).toPromise();
  }
}
