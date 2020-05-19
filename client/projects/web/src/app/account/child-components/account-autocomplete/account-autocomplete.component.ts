import { Component, Input } from '@angular/core';
import { Account, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account/account-autocomplete/account-autocomplete.service';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
  providers: [
    valueAccessorProvider(AccountAutocompleteComponent),
    AccountAutocompleteService,
    FormHelperService
  ]
})
export class AccountAutocompleteComponent extends FormComponentBase<string> {

  @Input() accountType: AccountType;
  @Input() placeholder = 'Search Accounts...';

  constructor(
    public accountHelper: AccountHelper,
    private _accountAutocompleteService: AccountAutocompleteService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  get accountAutocompleteStore(): ImmutableStore<Account[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  onChange(accountName: string): void {
    this._accountAutocompleteService.refreshAutocompleteOptions(accountName, this.accountType);
    this.onChangeCb(accountName);
  }

}
