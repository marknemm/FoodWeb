import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, EMPTY, of } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { LoginDialogComponent } from '../../components/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SessionMonitorService implements HttpInterceptor {

  constructor(
    private _matDialog: MatDialog,
    private _sessionService: SessionService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(this._handleError.bind(this)),
      flatMap(this._forwardRequestResponse.bind(this, request, next))
    );
  }

  private _handleError(error: any): Observable<any> {
    if (error instanceof HttpErrorResponse && error.status === 302) {
      return this._attemptLogin().pipe(
        map((loggedIn: boolean) => {
          if (!loggedIn) {
            this._errorHandlerService.handleError(error);
          }
          return { reAuthSucc: loggedIn };
        })
      );
    }
    throw error;
  }

  private _attemptLogin(): Observable<boolean> {
    return LoginDialogComponent.openIfNotLoggedIn(this._sessionService, this._matDialog, { disableClose: true }).pipe(
      map(() => this._sessionService.loggedIn)
    );
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
