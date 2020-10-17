import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';

@Component({ template: '' })
export class AccountCreationFormBaseComponent implements OnInit, OnDestroy {

  readonly AccountType = AccountType;

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

  get isDonor(): boolean {
    return this.accountType === AccountType.Donor;
  }

  get isReceiver(): boolean {
    return this.accountType === AccountType.Receiver;
  }

  get isVolunteer(): boolean {
    return this.accountType === AccountType.Volunteer;
  }

  get operationHoursDescription(): string {
    return (this.accountType === AccountType.Receiver)
      ? 'Optionally limit the times you will be considered available to receive deliveries.'
      : 'Optionally limit the times you will be considered available to perform deliveries.';
  }

  get operationHoursFullWidth(): boolean {
    return this.accountForm.get('operationHours').value.limitOperationHours;
  }

  ngOnInit() {
    if (!this.accountForm) {
      this.accountForm = new AccountForm({ destroy$: this._destroy$, formMode: 'Signup' });
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
      if (accountType && !this._activatedRoute.snapshot.url.toString().match(`${accountType}$`)) {
        this._router.navigate(['.', accountType], {
          relativeTo: this._activatedRoute,
          queryParamsHandling: 'preserve'
        });
      }
    });
  }

  protected _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.subscribe((routeParams: ParamMap) =>
      this._onAccountTypeRoute(<AccountType>routeParams.get('accountType'))
    );
  }

  protected _onAccountTypeRoute(accountType: AccountType): void {
    this.accountForm.get('accountType').setValue(accountType);
  }

}
