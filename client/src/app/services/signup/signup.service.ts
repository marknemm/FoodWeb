import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from '../session/session.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { SignupRequest } from './../../../../../shared/src/interfaces/signup-request';
import { Account } from './../../../../../shared/src/interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(
    private _httpClient: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
    private _sessionService: SessionService
  ) {}

  signup(request: SignupRequest): Observable<void> {
    return this._httpClient.post<Account>(
      '/server/signup',
      request
    ).pipe(
      map((account: Account) => { this._sessionService.account = account; }),
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    );
  }
}
