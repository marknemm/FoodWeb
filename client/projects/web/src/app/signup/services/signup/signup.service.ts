import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Account, SignupRequest } from '~shared';
import { environment } from '~web-env/environment';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  readonly url = `${environment.server}/account`;

  constructor(
    protected _alertService: AlertService,
    protected _authService: AuthenticationService,
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
  ) {}

  /**
   * Creates and saves a new user account with given user input signup data.
   * @param accountForm The `AccountForm` containing user input signup data.
   * @param agreed A flag determining if the user has agreed to signup terms and conditions.
   * @param successMessage The optional success message to display to the users via alert snackbar.
   * @return An observable that emits the created account upon success, null if signup agreement was not established.
   */
  createAccount(accountForm: AccountForm, agreed: boolean, successMessage = ''): Observable<Account> {
    if (agreed) {
      const signupRequest: SignupRequest = this._genSignupRequest(accountForm);
      return this._httpClient.post<Account>(this.url, signupRequest, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ successMessage }),
        mergeMap(() => this._authService.login(signupRequest.account.username, signupRequest.password, true)),
      );
    }

    this._alertService.displayMessage('You must accept the terms and conditions to complete signup', 'warn');
    return of(null);
  }

  /**
   * Generates a `SignupRequest` with given user input signup data.
   * @param accountForm The `AccountForm` containing user input signup data.
   * @returns The generated signup request.
   */
  protected _genSignupRequest(accountForm: AccountForm): SignupRequest {
    return {
      account: accountForm.toAccount(),
      password: accountForm.password
    };
  }
}
