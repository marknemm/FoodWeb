import { Component, OnInit } from '@angular/core';
import { AccountCreateOptions, AdminAccountForm } from '~admin/admin-account/forms/admin-account.form';
import { AdminAccountCreateService } from '~admin/admin-account/services/admin-account-create/admin-account-create.service';
import { AdminSignupVerificationService } from '~admin/admin-account/services/admin-signup-verification/admin-signup-verification.service';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { Account } from '~shared';
import { FormFieldService } from '~web/forms';
import { ImmutableStore } from '~web/shared/classes/immutable-store';

@Component({
  selector: 'foodweb-admin-create-account',
  templateUrl: './admin-account-create.component.html',
  styleUrls: ['./admin-account-create.component.scss'],
  providers: [FormFieldService, AdminAccountCreateService]
})
export class AdminAccountCreateComponent implements OnInit {

  constructor(
    public sessionService: AdminSessionService,
    public signupVerificationService: AdminSignupVerificationService,
    private _createAccountService: AdminAccountCreateService,
    private _formFieldService: FormFieldService<AdminAccountForm>
  ) {
    this._formFieldService.registerControl(new AdminAccountForm({ formMode: 'Signup' }));
  }

  get accountForm(): AdminAccountForm {
    return this._formFieldService.control;
  }

  get createdAccountStore(): ImmutableStore<Account> {
    return this._createAccountService.createdAccountStore;
  }

  ngOnInit(): void {
    this._listenAutoGenPassChange();
  }

  /**
   * Listens for the auto-gen password field's value to change.
   * On change, updates the enable/disable state of the form's password fields.
   */
  private _listenAutoGenPassChange(): void {
    this.accountForm.accountCreateOptionsForm.get('autoGenPassword').valueChanges.pipe(
      this._formFieldService.untilDestroy()
    ).subscribe(
      (autoGen: boolean) => {
        (autoGen)
          ? this.accountForm.accountForm.get('password').disable()
          : this.accountForm.accountForm.get('password').enable();
      }
    );
  }

  /**
   * Creates the account.
   */
  createAccount(): void {
    this.accountForm.markAllAsTouched();
    if (this.accountForm.valid) {
      const account: Account = this.accountForm.toAccount();
      const password: string = this.accountForm.password;
      const accountCreateOpts: AccountCreateOptions = this.accountForm.accountCreateOptions;
      this._createAccountService.createAccount(account, password, accountCreateOpts).subscribe();
    }
  }

}
