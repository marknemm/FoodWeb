import { Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Account, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account/account-autocomplete/account-autocomplete.service';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { TypedFormControl } from '~web/data-structure/typed-form-control';

@Component({
  selector: 'food-web-account-select',
  templateUrl: './account-select.component.html',
  styleUrls: ['./account-select.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AccountSelectComponent), multi: true }
  ]
})
export class AccountSelectComponent implements OnInit, ControlValueAccessor {

  @Input() accountType: AccountType;
  @Input() filterPlaceholder = 'Search Accounts...';
  @Input() formControl: TypedFormControl<Account>;
  @Input() formControlName = '';
  @Input() placeholder = 'Select an Account';

  readonly filterCtrl = new TypedFormControl<string>();

  private _onChangeCb: (account: Account) => void = () => {};
  private _onTouchedCb: () => void = () => {};

  constructor(
    public accountHelper: AccountHelper,
    public accountAutocompleteService: AccountAutocompleteService,
    @Optional() @Host() @SkipSelf()
    private _controlContainer: ControlContainer
  ) {}

  get accountAutocompleteStore(): ImmutableStore<Account[]> {
    return this.accountAutocompleteService.accountAutocompleteStore;
  }

  get onChangeCb(): (account: Account) => void {
    return this._onChangeCb;
  }

  get onTouchedCb(): () => void {
    return this._onTouchedCb;
  }

  ngOnInit() {
    if (!this.formControl) {
      this.formControl = (this.formControlName)
        ? <TypedFormControl<Account>>this._controlContainer.control.get(this.formControlName)
        : new TypedFormControl<Account>();
    }
  }

  writeValue(account: Account): void {
    this.formControl.setValue(account);
  }

  registerOnChange(onChangeCb: (account: Account) => void): void {
    this._onChangeCb = onChangeCb;
  }

  registerOnTouched(onTouchedCb: () => void): void {
    this._onTouchedCb = onTouchedCb;
  }

  setDisabledState(isDisabled: boolean): void {
    (isDisabled) ? this.filterCtrl.disable() : this.filterCtrl.enable();
    (isDisabled) ? this.formControl.disable() : this.formControl.enable();
  }

  onPanelOpened(filterInput: HTMLInputElement): void {
    filterInput.focus();
    filterInput.select();
  }

}
