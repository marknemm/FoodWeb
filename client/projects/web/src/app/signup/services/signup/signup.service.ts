import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    private _alertService: AlertService,
    private _authService: AuthenticationService,
    private _httpClient: HttpClient,
    private _httpResponseService: HttpResponseService,
  ) {}

  createAccount(accountForm: AccountForm, agreed: boolean): void {
    if (agreed) {
      const signupRequest: SignupRequest = {
        account: accountForm.toAccount(),
        password: accountForm.password
      };
      this._httpClient.post<Account>(this.url, signupRequest, { withCredentials: true }).pipe(
        mergeMap(() => this._authService.login(signupRequest.account.username, signupRequest.password, true)),
        this._httpResponseService.handleHttpResponse()
      ).subscribe();
    } else {
      this._alertService.displayMessage('You must accept the terms and conditions to complete signup', 'warn');
    }
  }
}
