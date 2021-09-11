import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpersonateService } from '~admin/admin-session/services/impersonate/impersonate.service';
import { AccountHelper } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountComponent } from '~web/account/components/account/account.component';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.scss'],
  providers: [FormFieldService]
})
export class AdminAccountComponent extends AccountComponent implements OnInit {

  constructor(
    public sessionService: SessionService,
    public accountHelper: AccountHelper,
    public impersonateService: ImpersonateService,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _formFieldService: FormFieldService<AccountForm>,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService,
  ) {
    super(sessionService, accountHelper, signupVerificationService, _accountReadService, _accountSaveService,
          _activatedRoute, _formFieldService, _router, _urlQueryService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // Force the password form model to use 'Signup' mode so that an admin doesn't need to enter in the current password on change.
    this.accountForm.setControl('password', new PasswordForm({ formMode: 'Signup' }));
  }

}
