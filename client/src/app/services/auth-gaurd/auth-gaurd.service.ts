import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { AlertService } from '../alert/alert.service';
import { LoginComponent } from '../../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(
    private _sessionService: SessionService,
    private _matDialog: MatDialog,
    private _alertService: AlertService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const allowActivate: boolean = this._genAllowActivate(route, state);
    if (!allowActivate) {
      return this._attemptLogin().pipe(
        map(this._handleLoginResult.bind(this))
      );
    }
    return of(allowActivate);
  }

  private _genAllowActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return !(state.url === '/account' && !route.queryParamMap.has('id'))
      || this._sessionService.loggedIn;
  }

  private _attemptLogin(): Observable<boolean> {
    return this._matDialog.open(LoginComponent, { disableClose: true }).afterClosed().pipe(
      map(() => this._sessionService.loggedIn)
    );
  }

  private _handleLoginResult(loggedIn: boolean): boolean {
    if (!loggedIn) {
      this._alertService.displaySimpleMessage('Login required', 'danger');
    }
    return loggedIn;
  }
}
