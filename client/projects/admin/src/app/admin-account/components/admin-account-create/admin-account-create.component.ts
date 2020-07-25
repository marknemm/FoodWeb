import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminSignupVerificationService } from '~admin/admin-account/admin-signup-verification/admin-signup-verification.service';
import { AdminAccountCreateService } from '~admin/admin-account/services/admin-account-create/admin-account-create';
import { AccountCreateOptions, AdminAccountForm } from '~admin/admin-account/forms/admin-account.form';
import { AdminSessionService } from '~admin/admin-session/admin-session/admin-session.service';
import { Account } from '~shared';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'foodweb-create-account',
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
    private _pageTitleService: PageTitleService,
    private _createAccountService: AdminAccountCreateService
  ) {}

  get createdAccountStore(): ImmutableStore<Account> {
    return this._createAccountService.createdAccountStore;
  }

  ngOnInit() {
    this._pageTitleService.title = 'Create Account';
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
    this.adminAccountForm.markAllAsTouched();
    if (this.adminAccountForm.valid) {
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
