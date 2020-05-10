import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { Account, DeepReadonly } from '~shared';
import { HttpResponseService } from '~web/shared/http-response/http-response.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminSignupVerificationService extends SignupVerificationService {

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    protected _sessionService: AdminSessionService
  ) {
    super(_activatedRoute, _httpClient, _httpResponseService, _sessionService);
  }

  /**
   * Resends a signup verification email for a given account.
   * @param account The account for which to resend the signup verification email.
   */
  resendVerificationEmailFor(account: DeepReadonly<Account>): void {
    if (!this.loading) {
      const url = `${this.url}/resend-verification-email/${account.id}`;
      this._httpClient.get(url, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ pageProgressBlocking: false, successMessage: 'Verification Email Resent' })
      ).subscribe();
    }
  }
}
