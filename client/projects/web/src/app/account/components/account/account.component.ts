import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Account, AccountHelper, AccountType, DonationReadRequest } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';
import { PasswordFormT } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: formProvider(AccountComponent)
})
export class AccountComponent extends FormBaseComponent<AccountForm> implements OnInit {

  readonly AccountType = AccountType;
  readonly contactInfoFields = ['contactInfo.email', 'contactInfo.phoneNumber', 'contactInfo.streetAddress',
                                'contactInfo.city', 'contactInfo.stateProvince', 'contactInfo.postalCode'];
  readonly notificationFields = ['contactInfo.enableEmail', 'contactInfo.enablePushNotification', 'contactInfo.notifyForEachDonation'];

  protected _originalAccount: Account;
  protected _accountNotFound = false;
  protected _hasAccountOwnership = false;
  protected _myAccount = false;
  protected _seeDonationsLinkParams: DonationReadRequest;

  constructor(
    public sessionService: SessionService,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService,
    formHelperService: FormHelperService
  ) {
    super(() => new AccountForm({ formMode: 'Account' }), formHelperService, true);
    this.savePassword = this.savePassword.bind(this);
  }

  get originalAccount(): Account {
    return this._originalAccount;
  }

  get accountType(): AccountType {
    return this.formGroup.get('accountType').value;
  }

  get accountNotFound(): boolean {
    return this._accountNotFound;
  }

  get hasAccountOwnership(): boolean {
    return this._hasAccountOwnership;
  }

  get operationHoursDescription(): string {
    return (this.accountType === AccountType.Receiver)
      ? 'Optionally limit the times you will be considered available to receive deliveries.'
      : 'Optionally limit the times you will be considered available to perform deliveries.';
  }

  get seeDonationsLinkParams(): DonationReadRequest {
    return this._seeDonationsLinkParams;
  }

  ngOnInit(): void {
    (this._router.url.indexOf('/my') >= 0)
      ? this._handleAccountChange(this.sessionService.account)
      : this._listenAccountChange();
  }

  private _listenAccountChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._accountReadService.getAccount(id))
    ).subscribe((account: Account) => this._handleAccountChange(account));
  }

  private _handleAccountChange(account: Account): void {
    this._hasAccountOwnership = false;
      this._accountNotFound = !account;
      if (!this._accountNotFound) {
        this._originalAccount = account;
        this._hasAccountOwnership = this.sessionService.hasAccountOwnership(account.id);
        this._seeDonationsLinkParams = this._genSeeDonationLinkParams(account);
        this.formGroup.patchValue(account);
      }
      this._renavigateToAccountPage();
  }

  private _genSeeDonationLinkParams(account: Account): DonationReadRequest {
    if (account) {
      switch (account.accountType) {
        case AccountType.Donor:     return { donorAccountId: account.id };
        case AccountType.Receiver:  return { receiverAccountId: account.id };
        case AccountType.Volunteer: return { delivererAccountId: account.id };
        default:                    throw new Error(`Invalid account type: ${account.accountType}`);
      }
    }
    return {};
  }

  private _renavigateToAccountPage(): void {
    this._router.navigate(
      [], {
        relativeTo: this._activatedRoute,
        queryParams: { expandAll: !this.hasAccountOwnership ? true : undefined },
        queryParamsHandling: 'merge',
        replaceUrl: true,
        fragment: this._activatedRoute.snapshot.fragment
      }
    );
  }

  saveAccountFields(fields: string[], successCb: () => void): void {
    const account: Account = this.formGroup.toAccount();
    this._accountSaveService.updateAccountFields(this.originalAccount, account, fields).subscribe(
      (savedAccount: Account) => this._handleSaveSuccess(savedAccount, fields, successCb)
    );
  }

  savePassword(successCb: () => void): void {
    const passwordUpdate: PasswordFormT = this.formGroup.passwordFormValue;
    this._accountSaveService.updatePassword(this._originalAccount, passwordUpdate).subscribe(
      () => {
        this.formGroup.get('password').setValue({ password: '', oldPassword: '', confirmPassword: '' });
        this._handleSaveSuccess(this.originalAccount, [], successCb);
      }
    );
  }

  private _handleSaveSuccess(savedAccount: Account, fields: string[], successCb: () => void): void {
    this._originalAccount = savedAccount;
    // Write saved values back to the account update form group (server may have modified or filled some values).
    this.formGroup.patchValue(
      this._accountSaveService.mergeAccountUpdateFields(savedAccount, {}, fields)
    );
    successCb();
  }
}
