import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { SessionService } from '../../../session/services/session/session.service';
import { ErrorHandlerService } from '../../../shared/services/error-handler/error-handler.service';
import { AlertService } from '../../../shared/services/alert/alert.service';
import { Account } from '../../../../../../shared/src/interfaces/account/account';
import { AccountVerificationRequest } from '../../../../../../shared/src/interfaces/account/account-verification-request';

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
    this._httpClient.get(url).pipe(
      catchError((err: HttpErrorResponse) => this._errorHandlerService.handleError(err))
    ).subscribe(
      () => this._alertService.displaySimpleMessage('Verification Email Resent', 'success')
    );
  }

  verifyAccount(): Observable<Account> {
    this._loading = true;
    const verificationToken: string = this._getVerificationToken();
    const request: AccountVerificationRequest = { verificationToken };
    return this._httpClient.post<Account>(`${this.url}/verify`, request).pipe(
      finalize(() => this._loading = false)
    ).pipe(
      map((account: Account) => this._sessionService.account = account)
    );
  }

  private _getVerificationToken(): string {
    return this._activatedRoute.snapshot.queryParamMap.get('verificationToken');
  }
}
