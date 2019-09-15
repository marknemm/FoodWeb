import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountForm, AccountFormT, PasswordUpdate } from '../../forms/account.form';
import { SessionService } from '../../../session/services/session/session.service';
import { AccountService, Account } from '../../services/account/account.service';
import { SectionEditService } from '../../../shared/services/section-edit/section-edit.service';
import { SignupVerificationService } from '../../../signup/services/signup-verification/signup-verification.service';
import { PasswordFormMode } from '../../../password/child-components/password/password.component';
import { DonationReadFilters } from '../../../../../../shared/src/interfaces/donation/donation-read-filters';
import { AccountHelper } from '../../../../../../shared/src/helpers/account-helper';

@Component({
  selector: 'food-web-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  providers: [SectionEditService]
})
export class AccountDetailsComponent implements OnInit {

  accountUpdateForm: AccountForm;

  private _originalAccount: Account;
  private _accountNotFound = false;
  private _isMyAccount = false;
  private _passwordFormMode: PasswordFormMode = 'Account';
  private _seeDonationsParams: DonationReadFilters;

  constructor(
    public sessionService: SessionService,
    public sectionEditService: SectionEditService<string>,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    private _accountService: AccountService,
    private _activatedRoute: ActivatedRoute
  ) {}

  get originalAccount(): Account{
    return this._originalAccount;
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
    this._initAccountForm();
    this._listenAccountChange();
  }

  private _initAccountForm(): void {
    this.accountUpdateForm = new AccountForm();
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
        setTimeout(() => this._refreshAccountFormValue(account, true));
      }
    });
  }

  private _genSeeDonationParams(account: Account): DonationReadFilters {
    return (account.accountType === 'Donor')
      ? { donorAccountId: account.id }
      : { receiverAccountId: account.id };
  }

  private _refreshAccountFormValue(account: Account, force = false): void {
    const accountSections: (keyof Account)[] = ['accountType', 'username', 'profileImgUrl', 'contactInfo'];
    accountSections.forEach((section: keyof Account) => {
      if (force || !this.sectionEditService.editing(section)) {
        this.accountUpdateForm.get(section).patchValue(account[section]);
      }
    });

    if (this.accountUpdateForm.get('accountType').value === 'Volunteer') {
      if (force || !this.sectionEditService.editing('volunteer')) {
        this.accountUpdateForm.get('volunteer').patchValue(account.volunteer);
      }
    } else {
      if (force || !this.sectionEditService.editing('organization')) {
        this.accountUpdateForm.get('organization').patchValue(account.organization);
      }
    }

    if (force || !this.sectionEditService.editing('operationHours')) {
      this.accountUpdateForm.get('operationHours').patchValue(account.operationHours);
    }

    if (force || !this.sectionEditService.editing('password')) {
      this.accountUpdateForm.get('password').reset();
    }
  }

  onEdit(sectionName: keyof Account): void {
    this.sectionEditService.toggleEdit(sectionName, this.accountUpdateForm.get(sectionName));
  }

  onSave(sectionName: keyof AccountFormT): void {
    if (this.sectionEditService.shouldSaveSection(sectionName)) {
      (sectionName !== 'password')
        ? this._saveAccount(sectionName)
        : this._savePassword();
    } else {
      this.sectionEditService.stopEdit(sectionName);
    }
  }

  private _saveAccount(sectionName: keyof AccountFormT): void {
    let accountUpdate: Partial<Account> = {};
    accountUpdate[sectionName] = this.accountUpdateForm.get(sectionName).value;
    this._accountService.updateAccount(this.originalAccount, accountUpdate).subscribe(
      (savedAccount: Account) => this._handleSaveSuccess(sectionName, savedAccount)
    );
  }

  private _savePassword(): void {
    const passwordUpdate: PasswordUpdate = this.accountUpdateForm.get('password').value;
    this._accountService.updatePassword(passwordUpdate).subscribe(
      () => this._handleSaveSuccess('password', this.originalAccount)
    );
  }

  private _handleSaveSuccess(sectionName: string, savedAccount: Account): void {
    this._originalAccount = savedAccount;
    this.sectionEditService.stopEdit(sectionName);
    this._refreshAccountFormValue(savedAccount);
  }

}
