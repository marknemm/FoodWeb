import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSessionService } from '~app/app-session/services/app-session/app-session.service';
import { AccountHelper } from '~shared';
import { AccountDetailsBaseComponent } from '~web/account/components/account-details/account-details.base.component';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-app-account-details',
  templateUrl: './app-account-details.component.html',
  styleUrls: ['./app-account-details.component.scss']
})
export class AppAccountDetailsComponent extends AccountDetailsBaseComponent {

  constructor(
    public sessionService: AppSessionService,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {
    super(sessionService, accountHelper, signupVerificationService, _accountReadService, _accountSaveService, _activatedRoute, _router);
  }
}
