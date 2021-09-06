import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Account, LoginResponse } from '~shared';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { LoginDialogComponent } from '~web/session/components/login-dialog/login-dialog.component';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SessionMonitorService implements HttpInterceptor {

  constructor(
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _matDialog: MatDialog
  ) {}

  /**
   * Intercepts all HTTP requests so that their responses may be monitored for errors with code 302 for login required.
   * Upon the detection of a 302 error response, attempts to reauthenticate (automatically & manually), and re-sends the
   * request upon successful re-authentication.
   * @param request The HTTP request to intercept.
   * @param next The next Http handler.
   * @returns An observable that emits an `HttpEvent` representing the response for the intercepted request.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(this._handleError.bind(this)),
      switchMap(this._forwardRequestResponse.bind(this, request, next))
    );
  }

  /**
   * Detects if any incoming error responses have a status code of 302 for login required,
   * and if so, attempts to reauthenticate with the server (first automatically, then manually via login dialog).
   * @param error The `HttpErrorResponse` intercepted by this HTTP interceptor.
   * @returns An observable that emits the result of the re-authentication attempt.
   */
  private _handleError(error: HttpErrorResponse): Observable<ReAuthResult> {
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
    throw error; // Not a 302 error code, so re-throw error so next HTTP handler/interceptor can handle it.
  }

  /**
   * Prompts the user with a login dialog so that they may manually reauthenticate upon a response with code 302 (login required).
   * @param error The authentication required `HttpErrorResponse` to display an alert for if login fails.
   * @returns An observable that emits the result of the manual re-authentication attempt.
   */
  private _promptLogin(error: HttpErrorResponse): Observable<ReAuthResult> {
    return LoginDialogComponent.open(this._matDialog, { disableClose: true }).pipe(
      map((loginAccount: Account) => {
        if (!loginAccount) {
          this._alertService.displayError(error);
          this._authService.logout();
        }
        return { reAuthSucc: !!loginAccount };
      })
    );
  }

  /**
   * Handles all responses, and determines if they resulted in a re-authentication attempt, and therefore should receive
   * special handling, or if no re-authentication was required and can be handled normally.
   * @param request The request that may be retried if re-authentication was successfully performed.
   * @param next The next HttpHandler.
   * @param response The response that may be handled normally by forwarding it to the next handler if no re-authentication
   * attempt occurred (302 response code was not detected above), or the result of a re-authentication attempt that happened above.
   * @returns An observable which emits an `HttpEvent` representing the resulting response which shall be forwarded
   * by this interceptor.
   */
  private _forwardRequestResponse(request: HttpRequest<any>, next: HttpHandler, response: any): Observable<HttpEvent<any>> {
    if (response.reAuthSucc === true) {
      return next.handle(request); // Re-send the request if a re-authentication has been successful.
    }
    if (response.reAuthSucc === false) {
      return EMPTY; // If re-authentication is unsuccessful, then return observable that emits no items and terminates normally.
    }
    return of(response); // No re-authentication was performed, so simply send response to next HTTP handler (normal flow).
  }
}

interface ReAuthResult {
  reAuthSucc: boolean;
}
