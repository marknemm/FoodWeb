import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSessionService } from '~admin/admin-session/admin-session/admin-session.service';
import { ImpersonateService } from '~admin/admin-session/impersonate/impersonate.service';
import { AccountHelper } from '~shared';
import { AccountDetailsComponent } from '~web/account/account-details/account-details.component';
import { AccountReadService } from '~web/account/account-read/account-read.service';
import { AccountSaveService } from '~web/account/account-save/account-save.service';
import { PasswordForm } from '~web/password/password.form';
import { SignupVerificationService } from '~web/signup/signup-verification/signup-verification.service';

@Component({
  selector: 'food-web-admin-account-details',
  templateUrl: './admin-account-details.component.html',
  styleUrls: [
    '../../../../../../web/src/app/account/components/account-details/account-details.component.scss',
    './admin-account-details.component.scss'
  ]
})
export class AdminAccountDetailsComponent extends AccountDetailsComponent implements OnInit {

  constructor(
    public sessionService: AdminSessionService,
    public accountHelper: AccountHelper,
    public impersonateService: ImpersonateService,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {
    super(sessionService, accountHelper, signupVerificationService, _accountReadService, _accountSaveService, _activatedRoute, _router);
  }

  ngOnInit() {
    super.ngOnInit();
    // Force the password form model to use 'Signup' mode so that an admin doesn't need to enter in the current password on change.
    this.accountForm.setControl('password', new PasswordForm({ formMode: 'Signup' }));
  }

}
