import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Account, AccountVerificationRequest } from '~shared';
import { environment } from '~web/../environments/environment';
import { SessionService } from '~web/session/services/session/session.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class SignupVerificationService {

  readonly url = `${environment.server}/account`;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    protected _sessionService: SessionService
  ) {}

  /**
   * Whether or not a signup verification request is loading.
   */
  get loading(): boolean {
    return this._httpResponseService.loading;
  }

  /**
   * Resends the current user's signup verification email.
   */
  resendVerificationEmail(): void {
    if (!this.loading) {
      const url = `${this.url}/resend-verification-email`;
      this._httpClient.get(url, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ pageProgressBlocking: false, successMessage: 'Verification Email Resent' })
      ).subscribe();
    }
  }

  /**
   * Verifies (signup) for an account associated with the signup verification token query param in the URL.
   * @return A promise that resolves to the verified account.
   */
  verifyAccount(): Observable<Account> {
    const verificationToken: string = this._activatedRoute.snapshot.queryParamMap.get('verificationToken');
    const request: AccountVerificationRequest = { verificationToken };
    return this._httpClient.post<Account>(`${this.url}/verify`, request, { withCredentials: true }).pipe(
      this._httpResponseService.handleHttpResponse<Account>({ handleErrorResponse: false, showPageProgressOnLoad: false }),
      tap((account: Account) => this._sessionService.saveAccount(account))
    );
  }
}
