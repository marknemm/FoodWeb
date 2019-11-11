import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, catchError } from 'rxjs/operators';
import { environment } from '~web-env/environment';
import { ErrorHandlerService, AlertService } from '~web/shared';
import { Account, AccountVerificationRequest } from '~shared';

import { SessionService } from '~web/session/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class SignupVerificationService {

  readonly url = `${environment.server}/account`;

  private _loading = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _httpClient: HttpClient,
    private _sessionService: SessionService,
    private _errorHandlerService: ErrorHandlerService,
    private _alertService: AlertService
  ) {}

  get loading(): boolean {
    return this._loading;
  }

  resendVerificationEmail(): void {
    const url = `${this.url}/resend-verification-email`;
    this._httpClient.get(url, { withCredentials: true }).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    ).subscribe(
      () => this._alertService.displaySimpleMessage('Verification Email Resent', 'success')
    );
  }

  verifyAccount(): Observable<Account> {
    this._loading = true;
    const verificationToken: string = this._getVerificationToken();
    const request: AccountVerificationRequest = { verificationToken };
    return this._httpClient.post<Account>(`${this.url}/verify`, request, { withCredentials: true }).pipe(
      finalize(() => this._loading = false)
    ).pipe(
      map((account: Account) => this._sessionService.account = account)
    );
  }

  private _getVerificationToken(): string {
    return this._activatedRoute.snapshot.queryParamMap.get('verificationToken');
  }
}
