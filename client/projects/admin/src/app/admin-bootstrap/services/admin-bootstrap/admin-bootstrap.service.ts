import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminSessionService } from '~admin/admin-session/admin-session/admin-session.service';

@Injectable({
  providedIn: 'root'
})
export class AdminBootstrapService implements CanActivate {

  private _loginSubscription = new Subscription();

  constructor(
    private _router: Router,
    private _sessionService: AdminSessionService
  ) {}

  listenSessionStateChange(): void {
    this._listenForLogin();
    this._listenForLogout();
  }

  private _listenForLogin(): void {
    this._loginSubscription.unsubscribe();
    this._loginSubscription = this._sessionService.login$.subscribe(() => {
      this._loginSubscription.unsubscribe();
      if (this._router.url.indexOf('/login') >= 0) {
        this._router.navigate(['/']);
      }
    });
  }

  private _listenForLogout(): void {
    this._sessionService.logout$.subscribe(() => {
      this._listenForLogin();
      this._router.navigate(['/login']);
    });
  }

  /**
   * Determines whether or not the user can enter the admin console (activate any non bootstrap route).
   * @return A promise that resolves to true if the user can enter the admin console, false if not.
   */
  canActivate(): Promise<boolean> {
    // Contact server via session refresh request to see if user is logged in.
    return this._sessionService.refreshSessionStatus().pipe(
      map(() => {
        if (!this._sessionService.loggedIn) {
          this._router.navigate(['/login']);
        }
        return this._sessionService.loggedIn;
      })
    ).toPromise();
  }
}
