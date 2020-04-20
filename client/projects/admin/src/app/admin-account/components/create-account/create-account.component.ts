import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreateAccountService } from '~admin/admin-account/create-account/create-account.service';
import { AccountCreateOptions, AdminAccountForm } from '~admin/admin-account/forms/admin-account.form';
import { AdminSessionService } from '~admin/admin-session/admin-session/admin-session.service';
import { Account } from '~shared';
import { PageTitleService } from '~web/shared/page-title/page-title.service';
import { SignupVerificationService } from '~web/signup/signup-verification/signup-verification.service';

@Component({
  selector: 'food-web-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  adminAccountForm: AdminAccountForm;

  private _createdAccount: Account;
  private _destory$ = new Subject();

  constructor(
    public sessionService: AdminSessionService,
    public signupVerificationService: SignupVerificationService,
    private _pageTitleService: PageTitleService,
    private _createAccountService: CreateAccountService
  ) {}

  get createdAccount(): Account {
    return this._createdAccount;
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
    const account: Account = this.adminAccountForm.toAccount();
    const password: string = this.adminAccountForm.password;
    const accountCreateOpts: AccountCreateOptions = this.adminAccountForm.toAccountCreateOptions();
    this._createAccountService.createAccount(account, password, accountCreateOpts).subscribe(
      (createdAccount: Account) => this._createdAccount = createdAccount
    );
  }

  ngOnDestroy() {
    this._destory$.next();
  }

}
