import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '~hybrid/session/services/authentication/authentication.service';
import { MobileDeviceService } from '~hybrid/shared/services/mobile-device/mobile-device.service';
import { Account, SignupRequest } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { HttpResponseService } from '~web/shared/services/http-response/http-response.service';
import { SignupService as WebSignupService } from '~web/signup/services/signup/signup.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService extends WebSignupService {

  constructor(
    protected _alertService: AlertService,
    protected _authService: AuthenticationService,
    protected _httpClient: HttpClient,
    protected _httpResponseService: HttpResponseService,
    private _mobileDeviceService: MobileDeviceService,
  ) {
    super(_alertService, _authService, _httpClient, _httpResponseService);
  }

  createAccount(accountForm: AccountForm, agreed: boolean): Observable<Account> {
    return super.createAccount(accountForm, agreed, 'Signup Successful, welcome to FoodWeb!');
  }

  protected _genSignupRequest(accountForm: AccountForm) {
    const signupRequest: SignupRequest = super._genSignupRequest(accountForm);
    signupRequest.skipVerification = this._mobileDeviceService.native;
    return signupRequest;
  }
}
