import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { map } from 'rxjs/operators';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';

@Injectable({
  providedIn: 'root'
})
export class AppAuthGuardService implements CanActivate {

  constructor(
    private _authenticationService: AppAuthenticationService,
    private _routerExt: RouterExtensions,
    private _sessionService: AppSessionService,
  ) {}

  /**
   * Determines whether or not the user can enter either the login or main portion of the app.
   * @return A promise that resolves to true if the user can enter the portion of the app they are attempting to access.
   */
  canActivate(): Promise<boolean> {
    // Contact server via session refresh request to see if user is logged in.
    return this._authenticationService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._routerExt.navigate(['login'], { clearHistory: true });
        }
        return this._sessionService.loggedIn;
      })
    ).toPromise();
  }
}
