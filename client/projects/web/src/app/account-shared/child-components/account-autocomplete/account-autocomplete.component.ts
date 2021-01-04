import { Component, Input } from '@angular/core';
import { AccountAutocompleteItem, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account-shared/services/account-autocomplete/account-autocomplete.service';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';
import { ImmutableStore } from '~web/shared/classes/immutable-store';

@Component({
  selector: 'foodweb-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
  providers: [
    formProvider(AccountAutocompleteComponent),
    AccountAutocompleteService,
    FormHelperService
  ]
})
export class AccountAutocompleteComponent extends FormBaseComponent<string> {

  @Input() accountType: AccountType;
  @Input() placeholder = 'Search Accounts...';

  constructor(
    public accountHelper: AccountHelper,
    private _accountAutocompleteService: AccountAutocompleteService,
    formHelperService: FormHelperService
  ) {
    super(new TFormControl<string>(), formHelperService);
  }

  get accountAutocompleteStore(): ImmutableStore<AccountAutocompleteItem[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  onChange(accountName: string): void {
    this._accountAutocompleteService.refreshAutocompleteItems(accountName, this.accountType);
    this.onChangeCb(accountName);
  }

}
