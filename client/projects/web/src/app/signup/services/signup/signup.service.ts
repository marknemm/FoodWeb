import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Account, SignupRequest } from '~shared';
import { environment } from '~web-env/environment';
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
   * @param account The {@link Account} containing user input signup (account) data.
   * @param password The password for the new user account.
   * @param agreed A flag determining if the user has agreed to signup terms and conditions.
   * @param successMessage The optional success message to display to the users via alert snackbar.
   * @return An observable that emits the created account upon success, null if signup agreement was not established.
   */
  createAccount(account: Account, password: string, agreed: boolean, successMessage = ''): Observable<Account> {
    if (agreed) {
      const signupRequest: SignupRequest = { account, password };
      return this._httpClient.post<Account>(this.url, signupRequest, { withCredentials: true }).pipe(
        this._httpResponseService.handleHttpResponse({ successMessage }),
        mergeMap(() => this._authService.login(signupRequest.account.username, signupRequest.password, true)),
      );
    }

    this._alertService.displayMessage('You must accept the terms and conditions to complete signup', 'warn');
    return of(null);
  }
}
