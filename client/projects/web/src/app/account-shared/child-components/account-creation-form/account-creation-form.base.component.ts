import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { FormBaseComponent, FormHelperService } from '~web/forms';

@Component({ template: '' })
export class AccountCreationFormBaseComponent extends FormBaseComponent<AccountForm> implements OnInit {

  readonly AccountType = AccountType;

  @Input() accountTypeSelTitle = 'Select The Account Type';
  @Input() formTitle: string;
  @Input() submitButtonTxt = 'Create Account';

  @Output() createAccount = new EventEmitter<AccountForm>();

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    formHelperService: FormHelperService,
  ) {
    super(new AccountForm({ formMode: 'Signup' }), formHelperService);
  }

  get accountType(): AccountType {
    return this.formGroup.get('accountType').value;
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
    return this.formGroup.get('operationHours').value.limitOperationHours;
  }

  ngOnInit() {
    this._listenAccountTypeSelect();
    this._listenAccountTypeRoute();
  }

  protected _listenAccountTypeSelect(): void {
    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.formGroup.onValueChanges('accountType').subscribe((accountType: AccountType) => {
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
    this.formGroup.get('accountType').setValue(accountType);
  }

}
