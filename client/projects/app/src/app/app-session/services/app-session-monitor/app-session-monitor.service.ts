import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { Account, LoginResponse } from '~shared';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';

@Injectable({
  providedIn: 'root'
})
export class AppSessionMonitorService implements HttpInterceptor {

  constructor(
    private _authService: AuthenticationService,
    private _alertQueueService: AlertQueueService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(this._handleError.bind(this)),
      switchMap(this._forwardRequestResponse.bind(this, request, next))
    );
  }

  private _handleError(error: any): Observable<ReAuthAttempt> {
    if (error instanceof HttpErrorResponse && error.status === 302) {
      // Refresh session status (sync with session status on server, and if mobile app, try to auto re-auth with token).
      return this._authService.checkIfUserLoggedIn().pipe(
        map((loginResponse: LoginResponse) => loginResponse.account),
        switchMap((account: Account) =>
          (account)
            ? of({ reAuthSucc: true })
            : this._promptLogin(error)
        )
      );
    }
    throw error;
  }

  private _promptLogin(error: any): Observable<ReAuthAttempt> {
    // return LoginDialogComponent.open(this._matDialog, { disableClose: true }).pipe(
    //   map((loginAccount: Account) => {
    //     const loggedIn: boolean = !!loginAccount;
    //     if (!loginAccount) {
    //       this._alertQueueService.handleError(error);
    //       this._authService.logout();
    //     }
    //     return { reAuthSucc: loggedIn };
    //   })
    // );
    return of({ reAuthSucc: true });
  }

  private _forwardRequestResponse(request: HttpRequest<any>, next: HttpHandler, response: any): Observable<HttpEvent<any>> {
    if (response.reAuthSucc === true) {
      return next.handle(request);
    }
    if (response.reAuthSucc === false) {
      return EMPTY;
    }
    return of(response);
  }
}

interface ReAuthAttempt {
  reAuthSucc: boolean;
}
