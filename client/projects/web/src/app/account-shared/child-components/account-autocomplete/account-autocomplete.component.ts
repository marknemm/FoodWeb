import { Component, Input } from '@angular/core';
import { AccountAutocompleteItem, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account-shared/services/account-autocomplete/account-autocomplete.service';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { FormHelperService } from '~web/shared/services/form-helper/form-helper.service';

@Component({
  selector: 'foodweb-account-autocomplete',
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

  get accountAutocompleteStore(): ImmutableStore<AccountAutocompleteItem[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  onChange(accountName: string): void {
    this._accountAutocompleteService.refreshAutocompleteItems(accountName, this.accountType);
    this.onChangeCb(accountName);
  }

}
