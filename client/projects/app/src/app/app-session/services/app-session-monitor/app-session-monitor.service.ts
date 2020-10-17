import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AppAuthenticationService } from '~app/app-session/services/app-authentication/app-authentication.service';
import { Account } from '~shared';

@Injectable({
  providedIn: 'root'
})
export class AppSessionMonitorService implements HttpInterceptor {

  constructor(
    private _authenticationService: AppAuthenticationService,
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
      return this._authenticationService.refreshSessionStatus().pipe(
        switchMap((account: Account) =>
          of({ reAuthSucc: !!account })
        )
      );
    }
    throw error;
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
