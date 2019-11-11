import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from '~web/shared';

import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { SessionService } from '~web/session/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(
    private _sessionService: SessionService,
    private _matDialog: MatDialog,
    private _alertService: AlertService
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
    return LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog, { disableClose: true }).pipe(
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
