import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '~app/app-session/services/app-session/app-session.service';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Injectable({
  providedIn: 'root'
})
export class AppAuthGaurdService implements CanActivate {

  constructor(
    private _alertQueueService: AlertQueueService,
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
    // return LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog, { disableClose: true }).pipe(
    //   map(() => this._sessionService.loggedIn)
    // );
    return of(true);
  }

  private _handleLoginResult(loggedIn: boolean): boolean {
    if (!loggedIn) {
      this._alertQueueService.add('Login required');
    }
    return loggedIn;
  }
}
