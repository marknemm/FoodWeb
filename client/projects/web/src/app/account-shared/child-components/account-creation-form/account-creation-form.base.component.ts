import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account/forms/account.form';

@Component({ template: '' })
export class AccountCreationFormBaseComponent implements OnInit, OnDestroy {

  @Input() accountForm: AccountForm;
  @Input() accountTypeSelTitle = 'Select The Account Type';
  @Input() formTitle: string;
  @Input() submitButtonTxt = 'Create Account';

  @Output() createAccount = new EventEmitter<AccountForm>();

  protected _destroy$ = new Subject();

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
  ) {}

  get accountType(): AccountType {
    return this.accountForm.get('accountType').value;
  }

  get operationHoursFullWidth(): boolean {
    return this.accountForm.get('operationHours').value.limitOperationHours;
  }

  ngOnInit() {
    if (!this.accountForm) {
      this.accountForm = new AccountForm({ formMode: 'Signup' }, this._destroy$);
    }
    this._listenAccountTypeSelect();
    this._listenAccountTypeRoute();
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  protected _listenAccountTypeSelect(): void {
    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.accountForm.get('accountType').valueChanges.pipe(
      takeUntil(this._destroy$)
    ).subscribe((accountType: AccountType) => {
      if (!this._activatedRoute.snapshot.url.toString().match(`${accountType}$`)) {
        this._router.navigate(['.', accountType], { relativeTo: this._activatedRoute });
      }
    });
  }

  protected _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.subscribe((routeParams: ParamMap) => {
      const accountTypeParam = <AccountType>routeParams.get('accountType');
      if (accountTypeParam) {
        this.accountForm.get('accountType').setValue(accountTypeParam);
      }
    });
  }

}
