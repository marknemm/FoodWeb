import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountForm, PasswordFormT, AccountFormKey } from '../../forms/account.form';
import { PasswordFormMode } from '../../../password/forms/password.form';
import { SessionService } from '../../../session/services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { SectionEditService } from '../../../shared/services/section-edit/section-edit.service';
import { SignupVerificationService } from '../../../signup/services/signup-verification/signup-verification.service';
import { DonationReadFilters } from '../../../../../../shared/src/interfaces/donation/donation-read-filters';
import { AccountHelper } from '../../../../../../shared/src/helpers/account-helper';
import { AccountType } from '../../../../../../shared/src/interfaces/account/account';

@Component({
  selector: 'food-web-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: [SectionEditService]
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  accountUpdateForm: AccountForm;

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
    public sectionEditService: SectionEditService<AccountFormKey>,
    private _accountService: AccountService,
    private _activatedRoute: ActivatedRoute
  ) {}

  get originalAccount(): Account{
    return this._originalAccount;
  }

  get accountType(): AccountType {
    return this.accountUpdateForm.get('accountType').value;
  }

  get limitOperationHours(): boolean {
    return this.accountUpdateForm.get('operationHours').value.limitOperationHours;
  }

  get operationHoursFullWidth(): boolean {
    return (this.sectionEditService.editing('operationHours') && this.limitOperationHours);
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
    this.accountUpdateForm = new AccountForm({ formMode: 'Account' }, this._destroy$, this.sectionEditService);
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
        this._passwordFormMode = (this.sessionService.isAdmin ? 'Signup' : 'Account');
        this._refreshAccountFormValue(account, true);
      }
    });
  }

  private _genSeeDonationParams(account: Account): DonationReadFilters {
    return (account.accountType === 'Donor')
      ? { donorAccountId: account.id }
      : { receiverAccountId: account.id };
  }

  private _refreshAccountFormValue(account: Account, force = false): void {
    (force)
      ? this.accountUpdateForm.patchValue(account)
      : this.accountUpdateForm.patchSections(account);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  onEdit(sectionName: AccountFormKey): void {
    this.sectionEditService.toggleEdit(sectionName, this.accountUpdateForm.get(sectionName));
  }

  onSave(sectionName: AccountFormKey): void {
    if (this.sectionEditService.shouldSaveSection(sectionName)) {
      (sectionName !== 'password')
        ? this._saveAccount(sectionName)
        : this._savePassword();
    } else {
      this.sectionEditService.stopEdit(sectionName);
    }
  }

  private _saveAccount(sectionName: AccountFormKey): void {
    let accountUpdate: Partial<Account> = {};
    accountUpdate[sectionName] = this.accountUpdateForm.toAccount()[sectionName];
    this._accountService.updateAccount(this.originalAccount, accountUpdate).subscribe(
      (savedAccount: Account) => this._handleSaveSuccess(sectionName, savedAccount)
    );
  }

  private _savePassword(): void {
    const passwordUpdate: PasswordFormT = this.accountUpdateForm.toPassword();
    this._accountService.updatePassword(passwordUpdate).subscribe(
      () => this._handleSaveSuccess('password', this.originalAccount)
    );
  }

  private _handleSaveSuccess(sectionName: AccountFormKey, savedAccount: Account): void {
    this._originalAccount = savedAccount;
    this.sectionEditService.stopEdit(sectionName);
    this._refreshAccountFormValue(savedAccount);
  }

}
