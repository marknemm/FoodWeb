import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountHelper, AccountType, DonationReadFilters } from '~shared';
import { AccountForm, AccountFormKey } from '~web/account/account.form';
import { Account, AccountService } from '~web/account/account/account.service';
import { PasswordFormMode, PasswordFormT } from '~web/password/password.form';
import { SessionService } from '~web/session/session/session.service';
import { SaveCb } from '~web/shared/child-components/edit-save-button/edit-save-button.component';
import { SignupVerificationService } from '~web/signup/signup-verification/signup-verification.service';

@Component({
  selector: 'food-web-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  formGroup: AccountForm;

  private _originalAccount: Account;
  private _accountNotFound = false;
  private _isMyAccount = false;
  private _passwordFormMode: PasswordFormMode = 'Account';
  private _seeDonationsParams: DonationReadFilters;
  private _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    private _accountService: AccountService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.savePassword = this.savePassword.bind(this);
  }

  get originalAccount(): Account{
    return this._originalAccount;
  }

  get accountType(): AccountType {
    return this.formGroup.get('accountType').value;
  }

  get accountNotFound(): boolean {
    return this._accountNotFound;
  }

  get isMyAccount(): boolean {
    return this._isMyAccount
  }

  get passwordFormMode(): PasswordFormMode {
    return this._passwordFormMode;
  }

  get seeDonationsParams(): DonationReadFilters {
    return this._seeDonationsParams;
  }

  ngOnInit() {
    this.formGroup = new AccountForm({ formMode: 'Account' }, this._destroy$);
    this._listenAccountChange();
  }

  private _listenAccountChange(): void {
    this._accountService.listenAccountQueryChange(this._activatedRoute).subscribe((account: Account) => {
      this._accountNotFound = !account;
      if (!this._accountNotFound) {
        this._originalAccount = account;
        this._isMyAccount = this.sessionService.isMyAccount(account.id);
        this._seeDonationsParams = this._genSeeDonationParams(account);
        // An admin account does not need to input the old password to update an account password.
        this._passwordFormMode = 'Account';
        this.formGroup.patchValue(account);
      }
    });
  }

  private _genSeeDonationParams(account: Account): DonationReadFilters {
    return (account.accountType === 'Donor')
      ? { donorAccountId: account.id }
      : { receiverAccountId: account.id };
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  genSectionSaveCb(sectionName: AccountFormKey): SaveCb {
    return () => this._saveAccountSection(sectionName);
  }

  private _saveAccountSection(sectionName: AccountFormKey): Observable<boolean> {
    const sectionValue: any = this.formGroup.get(sectionName).value;
    return this._accountService.updateAccountSection(sectionName, sectionValue).pipe(
      map((savedAccount: Account) =>
        this._handleSaveSuccess(sectionName, savedAccount) // Implicit return true.
      )
    );
  }

  savePassword(): Observable<boolean> {
    const passwordUpdate: PasswordFormT = this.formGroup.toPassword();
    return this._accountService.updatePassword(passwordUpdate).pipe(
      map(() => this._handleSaveSuccess('password', this.originalAccount)) // Implicit return true.
    );
  }

  private _handleSaveSuccess(sectionName: AccountFormKey, savedAccount: Account): true {
    this._originalAccount = savedAccount;
    const accountSectionPatch: Partial<Account> = {};
    accountSectionPatch[sectionName] = savedAccount[sectionName];
    this.formGroup.patchValue(accountSectionPatch);
    return true;
  }

}

export type AccountPanel = 'availability' | 'notifications' | 'password' | 'primary';
