import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Account, AccountHelper, AccountType, DonationReadRequest } from '~shared';
import { AccountForm, AccountFormAdapter, AccountFormData } from '~web/account-shared/services/account-form-adapter/account-form-adapter.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormFieldService } from '~web/forms';
import { PasswordFormData } from '~web/password/services/password-form-adapter/password-form-adapter.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ObjectService } from '~web/shared/services/object/object.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({
  selector: 'foodweb-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [FormFieldService]
})
export class AccountComponent implements OnInit {

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
    protected _accountFormAdapter: AccountFormAdapter,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _formFieldService: FormFieldService<AccountFormData>,
    protected _objectService: ObjectService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService,
  ) {
    this.savePassword = this.savePassword.bind(this);
  }

  get accountForm(): AccountForm {
    return this._formFieldService.control;
  }

  get originalAccount(): Account {
    return this._originalAccount;
  }

  get accountType(): AccountType {
    return this.accountForm.get('accountType').value;
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
    this._formFieldService.injectControl({
      genDefault: () => this._accountFormAdapter.toForm({ destroy$: this._formFieldService.destroy$ })
    });

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
      this.accountForm.patchValue(this._accountFormAdapter.toViewModel(account));
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
    const account: Account = this._accountFormAdapter.toModel(this.accountForm);
    this._accountSaveService.updateAccountFields(this.originalAccount, account, fields).subscribe(
      (savedAccount: Account) => {
        this._originalAccount = savedAccount;
        const patchAccount: Partial<Account> = this._objectService.mergeFields(savedAccount, {}, fields);
        // Write saved values back to the account update form group (server may have modified or filled some values).
        this.accountForm.patchValue(this._accountFormAdapter.toViewModel(patchAccount));
        successCb();
      }
    );
  }

  savePassword(successCb: () => void): void {
    const passwordUpdate: PasswordFormData = this.accountForm.controls.password.getRawValue();
    this._accountSaveService.updatePassword(this._originalAccount, passwordUpdate).subscribe(
      () => {
        this.accountForm.get('password').setValue({ password: '', oldPassword: '', confirmPassword: '' });
        successCb();
      }
    );
  }
}
