import { Component, OnInit } from '@angular/core';
import { AccountCreateOptions, AdminAccountForm } from '~admin/admin-account/forms/admin-account.form';
import { AdminAccountCreateService } from '~admin/admin-account/services/admin-account-create/admin-account-create.service';
import { AdminSignupVerificationService } from '~admin/admin-account/services/admin-signup-verification/admin-signup-verification.service';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { Account } from '~shared';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { ImmutableStore } from '~web/shared/classes/immutable-store';

@Component({
  selector: 'foodweb-admin-create-account',
  templateUrl: './admin-account-create.component.html',
  styleUrls: ['./admin-account-create.component.scss'],
  providers: [formProvider(AdminAccountCreateComponent), AdminAccountCreateService]
})
export class AdminAccountCreateComponent extends FormBaseComponent<AdminAccountForm> implements OnInit {

  constructor(
    public sessionService: AdminSessionService,
    public signupVerificationService: AdminSignupVerificationService,
    private _createAccountService: AdminAccountCreateService,
    formHelperService: FormHelperService
  ) {
    super(() => new AdminAccountForm({ formMode: 'Signup' }), formHelperService, true);
  }

  get createdAccountStore(): ImmutableStore<Account> {
    return this._createAccountService.createdAccountStore;
  }

  ngOnInit() {
    this._listenAutoGenPassChange();
  }

  /**
   * Listens for the auto-gen password field's value to change.
   * On change, updates the enable/disable state of the form's password fields.
   */
  private _listenAutoGenPassChange(): void {
    this.formGroup.accountCreateOptionsForm.onControlValueChanges('autoGenPassword').subscribe(
      (autoGen: boolean) => {
        (autoGen)
          ? this.formGroup.accountForm.get('password').disable()
          : this.formGroup.accountForm.get('password').enable();
      }
    );
  }

  /**
   * Creates the account.
   */
  createAccount(): void {
    if (this.formGroup.checkValidity()) {
      const account: Account = this.formGroup.toAccount();
      const password: string = this.formGroup.password;
      const accountCreateOpts: AccountCreateOptions = this.formGroup.accountCreateOptions;
      this._createAccountService.createAccount(account, password, accountCreateOpts).subscribe();
    }
  }

}
