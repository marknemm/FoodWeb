import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { ImpersonateService } from '~admin/admin-session/services/impersonate/impersonate.service';
import { AccountHelper } from '~shared';
import { AccountComponent } from '~web/account/components/account/account.component';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormHelperService, formProvider } from '~web/forms';
import { PasswordForm } from '~web/password/forms/password.form';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-admin-account',
  templateUrl: './admin-account.component.html',
  styleUrls: ['./admin-account.component.scss'],
  providers: formProvider(AdminAccountComponent)
})
export class AdminAccountComponent extends AccountComponent implements OnInit {

  constructor(
    public sessionService: AdminSessionService,
    public accountHelper: AccountHelper,
    public impersonateService: ImpersonateService,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService,
    formHelperService: FormHelperService,
  ) {
    super(sessionService, accountHelper, signupVerificationService, _accountReadService,
          _accountSaveService, _activatedRoute, _router, _urlQueryService, formHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    // Force the password form model to use 'Signup' mode so that an admin doesn't need to enter in the current password on change.
    this.formGroup.setControl('password', new PasswordForm({ formMode: 'Signup' }));
  }

}
