import { Component } from '@angular/core';
import { Account, SessionService } from '~hybrid/session/services/session/session.service';
import { AccountType } from '~shared';
import { AuthenticationService } from '~web/session/services/authentication/authentication.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-hybrid-settings-portal',
  templateUrl: './settings-portal.component.html',
  styleUrls: ['./settings-portal.component.scss']
})
export class SettingsPortalComponent {

  readonly AccountType = AccountType;

  constructor(
    public signupVerificationService: SignupVerificationService,
    private _authenticationService: AuthenticationService,
    private _sessionService: SessionService,
  ) {}

  get account(): Account {
    return this._sessionService.account;
  }

  logout(): void {
    this._authenticationService.logout();
  }

}
