import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { ImpersonateService } from '~admin/admin-session/services/impersonate/impersonate.service';
import { AccountHelper } from '~shared';
import { AccountDetailsComponent } from '~web/account/components/account-details/account-details.component';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { formProvider } from '~web/data-structure/form-base-component';
import { PasswordForm } from '~web/password/forms/password.form';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-admin-account-details',
  templateUrl: './admin-account-details.component.html',
  styleUrls: ['./admin-account-details.component.scss'],
  providers: formProvider(AdminAccountDetailsComponent)
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
    protected _router: Router,
    formHelperService: FormHelperService,
  ) {
    super(sessionService, accountHelper, signupVerificationService, _accountReadService,
          _accountSaveService, _activatedRoute, _router, formHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    // Force the password form model to use 'Signup' mode so that an admin doesn't need to enter in the current password on change.
    this.formGroup.setControl('password', new PasswordForm({ formMode: 'Signup' }));
  }

}
