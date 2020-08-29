import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountCreateOptions, AdminAccountForm } from '~admin/admin-account/forms/admin-account.form';
import { AdminAccountCreateService } from '~admin/admin-account/services/admin-account-create/admin-account-create.service';
import { AdminSignupVerificationService } from '~admin/admin-account/services/admin-signup-verification/admin-signup-verification.service';
import { AdminSessionService } from '~admin/admin-session/services/admin-session/admin-session.service';
import { Account } from '~shared';
import { ImmutableStore } from '~web/data-structure/immutable-store';

@Component({
  selector: 'foodweb-admin-create-account',
  templateUrl: './admin-account-create.component.html',
  styleUrls: ['./admin-account-create.component.scss'],
  providers: [AdminAccountCreateService]
})
export class AdminAccountCreateComponent implements OnInit, OnDestroy {

  adminAccountForm: AdminAccountForm;

  private _destory$ = new Subject();

  constructor(
    public sessionService: AdminSessionService,
    public signupVerificationService: AdminSignupVerificationService,
    private _createAccountService: AdminAccountCreateService
  ) {}

  get createdAccountStore(): ImmutableStore<Account> {
    return this._createAccountService.createdAccountStore;
  }

  ngOnInit() {
    this.adminAccountForm = new AdminAccountForm({ formMode: 'Signup' }, this._destory$);
    this._listenAutoGenPassChange();
  }

  /**
   * Listens for the auto-gen password field's value to change.
   * On change, updates the enable/disable state of the form's password fields.
   */
  private _listenAutoGenPassChange(): void {
    this.adminAccountForm.accountCreateOptionsForm.get('autoGenPassword').valueChanges.pipe(
      takeUntil(this._destory$)
    ).subscribe((autoGen: boolean) => {
      (autoGen)
        ? this.adminAccountForm.accountForm.get('password').disable()
        : this.adminAccountForm.accountForm.get('password').enable();
    });
  }

  /**
   * Creates the account.
   */
  createAccount(): void {
    if (this.adminAccountForm.checkValidity()) {
      const account: Account = this.adminAccountForm.toAccount();
      const password: string = this.adminAccountForm.password;
      const accountCreateOpts: AccountCreateOptions = this.adminAccountForm.accountCreateOptions;
      this._createAccountService.createAccount(account, password, accountCreateOpts).subscribe();
    }
  }

  ngOnDestroy() {
    this._destory$.next();
  }

}
