import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService implements CanActivate {

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router
  ) {}

  /**
   * Determines whether or not the user can enter the app (activate any non app-bootstrap route).
   * @return A promise that resolves to true if the user can enter the app, false if not.
   */
  canActivate(): Promise<boolean> {
    // Contact server via session refresh request to see if user is logged in.
    return this._authenticationService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._authenticationService.loggedIn) {
          this._router.navigate(['/login']);
        }
        setTimeout(() => SplashScreen.hide());
        return this._authenticationService.loggedIn;
      })
    ).toPromise();
  }
}
