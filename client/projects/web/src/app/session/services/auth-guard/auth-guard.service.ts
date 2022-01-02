import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { SessionService } from '~web/session/services/session/session.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _sessionService: SessionService,
  ) {}

  canActivate(): Observable<boolean> {
    const allowActivate: boolean = this._sessionService.loggedIn;
    if (!allowActivate) {
      return this._attemptLogin().pipe(
        map(this._handleLoginResult.bind(this))
      );
    }
    return of(allowActivate);
  }

  private _attemptLogin(): Observable<boolean> {
    return this._authService.openLoginDialogIfNotLoggedIn(true).pipe(
      map(() => this._sessionService.loggedIn)
    );
  }

  private _handleLoginResult(loggedIn: boolean): boolean {
    if (!loggedIn) {
      this._alertService.displayMessage('Login required', 'warn');
    }
    return loggedIn;
  }
}
