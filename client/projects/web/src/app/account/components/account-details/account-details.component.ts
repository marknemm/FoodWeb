import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Account, AccountHelper, AccountType, DonationReadRequest } from '~shared';
import { AccountReadService } from '~web/account/account-read/account-read.service';
import { AccountSaveService } from '~web/account/account-save/account-save.service';
import { AccountForm, AccountFormKey } from '~web/account/account.form';
import { PasswordFormT } from '~web/password/password.form';
import { SessionService } from '~web/session/session/session.service';
import { SaveCb } from '~web/shared/child-components/edit-save-button/edit-save-button.component';
import { SignupVerificationService } from '~web/signup/signup-verification/signup-verification.service';

@Component({
  selector: 'food-web-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {

  accountForm: AccountForm;

  protected _originalAccount: Account;
  protected _accountNotFound = false;
  protected _hasAccountOwnership = false;
  protected _seeDonationsLinkParams: DonationReadRequest;
  protected _destroy$ = new Subject();

  constructor(
    public sessionService: SessionService,
    public accountHelper: AccountHelper,
    public signupVerificationService: SignupVerificationService,
    protected _accountReadService: AccountReadService,
    protected _accountSaveService: AccountSaveService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {
    this.savePassword = this.savePassword.bind(this);
  }

  get originalAccount(): Account{
    return this._originalAccount;
  }

  get accountType(): AccountType {
    return this.accountForm.get('accountType').value;
  }

  get accountNotFound(): boolean {
    return this._accountNotFound;
  }

  get hasAccountOwnership(): boolean {
    return this._hasAccountOwnership
  }

  get seeDonationsLinkParams(): DonationReadRequest {
    return this._seeDonationsLinkParams;
  }

  ngOnInit() {
    this.accountForm = new AccountForm({ formMode: 'Account' }, this._destroy$);
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
        this.accountForm.patchValue(account);
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

  ngOnDestroy() {
    this._destroy$.next();
  }

  genSectionSaveCb(sectionName: AccountFormKey): SaveCb {
    return () => this._saveAccountSection(sectionName);
  }

  private _saveAccountSection(sectionName: AccountFormKey): Observable<boolean> {
    const account: Account = this.accountForm.toAccount();
    return this._accountSaveService.updateAccountSection(account, <keyof Account>sectionName).pipe(
      map((savedAccount: Account) =>
        this._handleSaveSuccess(sectionName, savedAccount) // Implicit return true.
      )
    );
  }

  savePassword(): Observable<boolean> {
    const passwordUpdate: PasswordFormT = this.accountForm.passwordFormValue;
    return this._accountSaveService.updatePassword(this._originalAccount, passwordUpdate).pipe(
      map(() => this._handleSaveSuccess('password', this.originalAccount)) // Implicit return true.
    );
  }

  private _handleSaveSuccess(sectionName: AccountFormKey, savedAccount: Account): true {
    this._originalAccount = savedAccount;
    const accountSectionPatch: Partial<Account> = {};
    (<any>accountSectionPatch)[sectionName] = savedAccount[<keyof Account>sectionName];
    this.accountForm.patchValue(accountSectionPatch);
    return true;
  }

}

export type AccountPanel = 'availability' | 'notifications' | 'password' | 'primary';
