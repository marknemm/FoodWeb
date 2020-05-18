import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Account, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account/account-autocomplete/account-autocomplete.service';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { TypedFormControl } from '~web/data-structure/typed-form-control';

@Component({
  selector: 'food-web-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AccountAutocompleteComponent), multi: true }
  ]
})
export class AccountAutocompleteComponent implements OnInit, ControlValueAccessor {

  @Input() placeholder = 'Search Accounts...';
  @Input() accountType: AccountType;

  readonly accountNameCtrl = new TypedFormControl<string>();

  private _onChangeCb: (accountName: string) => void = () => {};
  private _onTouchedCb: () => void = () => {};

  constructor(
    public accountHelper: AccountHelper,
    private _accountAutocompleteService: AccountAutocompleteService
  ) {}

  get accountAutocompleteStore(): ImmutableStore<Account[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  get onChangeCb(): (accountName: string) => void {
    return this._onChangeCb;
  }

  get onTouchedCb(): () => void {
    return this._onTouchedCb;
  }

  ngOnInit() {}

  writeValue(accountName: string): void {
    this.accountNameCtrl.setValue(accountName);
  }

  registerOnChange(onChangeCb: (accountName: string) => void): void {
    this._onChangeCb = onChangeCb;
  }

  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  setDisabledState(isDisabled: boolean): void {
    (isDisabled) ? this.accountNameCtrl.disable() : this.accountNameCtrl.enable();
  }

  onChange(accountName: string): void {
    this._accountAutocompleteService.refreshAutocompleteOptions(accountName, this.accountType);
    this._onChangeCb(accountName);
  }

}
