import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Account, AccountHelper, AccountType, DonationReadRequest } from '~shared';
import { AccountForm, AccountFormKey } from '~web/account-shared/forms/account.form';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSaveService } from '~web/account/services/account-save/account-save.service';
import { FormBaseComponent, FormHelperService } from '~web/forms';
import { PasswordFormT } from '~web/password/forms/password.form';
import { SessionService } from '~web/session/services/session/session.service';
import { SignupVerificationService } from '~web/signup/services/signup-verification/signup-verification.service';

@Component({ template: '' })
export class AccountDetailsBaseComponent extends FormBaseComponent<AccountForm> implements OnInit {

  readonly AccountType = AccountType;

  protected _originalAccount: Account;
  protected _accountNotFound = false;
  protected _hasAccountOwnership = false;
  protected _seeDonationsLinkParams: DonationReadRequest;

  constructor(
    public sessionService: SessionService,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    formHelperService: FormHelperService
  ) {
    super(new AccountForm({ formMode: 'Account' }), formHelperService);
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

  ngOnInit() {
    this._listenAccountChange();
  }

  private _listenAccountChange(): void {
    this._activatedRoute.params.pipe(
      switchMap((params: Params) => this._accountReadService.handleAccountQueryChange(params))
    ).subscribe((account: Account) => {
      this._hasAccountOwnership = false;
      this._accountNotFound = !account;
      if (!this._accountNotFound) {
        this._originalAccount = account;
        this._hasAccountOwnership = this.sessionService.hasAccountOwnership(account.id);
        this._seeDonationsLinkParams = this._genSeeDonationLinkParams(account);
        this.formGroup.patchValue(account);
      }
      this._renavigateToAccountDetailsPage();
    });
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

  private _renavigateToAccountDetailsPage(): void {
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

  genSectionSaveCb(sectionName: AccountFormKey): SaveCb {
    return () => this._saveAccountSection(sectionName);
  }

  private _saveAccountSection(sectionName: AccountFormKey): Observable<boolean> {
    const account: Account = this.formGroup.toAccount();
    return this._accountSaveService.updateAccountSection(account, <keyof Account>sectionName).pipe(
      map((savedAccount: Account) =>
        this._handleSaveSuccess(sectionName, savedAccount) // Implicit return true.
      )
    );
  }

  savePassword(): Observable<boolean> {
    const passwordUpdate: PasswordFormT = this.formGroup.passwordFormValue;
    return this._accountSaveService.updatePassword(this._originalAccount, passwordUpdate).pipe(
      map(() => this._handleSaveSuccess('password', this.originalAccount)) // Implicit return true.
    );
  }

  private _handleSaveSuccess(sectionName: AccountFormKey, savedAccount: Account): true {
    this._originalAccount = savedAccount;
    const accountSectionPatch: Partial<Account> = {};
    (<any>accountSectionPatch)[sectionName] = savedAccount[<keyof Account>sectionName];
    this.formGroup.patchValue(accountSectionPatch);
    return true;
  }

}

export type AccountPanel = 'availability' | 'notifications' | 'password' | 'primary';
