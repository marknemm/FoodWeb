import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountType } from '~shared';
import { AccountForm } from '~web/account-shared/forms/account.form';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-account-creation-form',
  templateUrl: './account-creation-form.component.html',
  styleUrls: ['./account-creation-form.component.scss'],
  providers: [FormFieldService]
})
export class AccountCreationFormComponent implements OnInit {

  readonly AccountType = AccountType;

  @Input() accountTypeSelTitle = 'Select The Account Type';
  @Input() formTitle: string;
  @Input() submitButtonTxt = 'Create Account';

  @Output() createAccount = new EventEmitter<AccountForm>();

  constructor(
    public location: Location,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    private _formFieldService: FormFieldService<AccountForm>
  ) {}

  get accountForm(): AccountForm {
    return this._formFieldService.control;
  }

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
    this._formFieldService.injectControl({
      genDefault: () => new AccountForm({ formMode: 'Signup' })
    });
    this._listenAccountTypeSelect();
    this._listenAccountTypeRoute();
  }

  private _listenAccountTypeSelect(): void {
    // When accountType form field is updated, we must update route so user can rely on back button / link directly to correct signup.
    this.accountForm.get('accountType').valueChanges.subscribe((accountType: AccountType) => {
      if (accountType && !this._activatedRoute.snapshot.url.toString().match(`${accountType}$`)) {
        this._router.navigate(['.', accountType], {
          relativeTo: this._activatedRoute,
          queryParamsHandling: 'preserve'
        });
      }
    });
  }

  private _listenAccountTypeRoute(): void {
    this._activatedRoute.paramMap.subscribe((routeParams: ParamMap) =>
      this._onAccountTypeRoute(<AccountType>routeParams.get('accountType'))
    );
  }

  private _onAccountTypeRoute(accountType: AccountType): void {
    this.accountForm.get('accountType').setValue(accountType);
  }
}
