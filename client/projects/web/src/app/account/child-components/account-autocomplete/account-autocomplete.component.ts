import { Component, Input, OnInit } from '@angular/core';
import { Account, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account/account-autocomplete/account-autocomplete.service';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { ImmutableStore } from '~web/data-structure/immutable-store';

@Component({
  selector: 'food-web-account-autocomplete',
  templateUrl: './account-autocomplete.component.html',
  styleUrls: ['./account-autocomplete.component.scss'],
})
export class AccountAutocompleteComponent implements OnInit {

  @Input() placeholder = 'Search Accounts...';
  @Input() accountType: AccountType;

  readonly accountCtrl = new TypedFormControl<Account>();

  constructor(
    public accountHelper: AccountHelper,
    private _accountAutocompleteService: AccountAutocompleteService
  ) {}

  get accountAutocompleteStore(): ImmutableStore<Account[]> {
    return this._accountAutocompleteService.accountAutocompleteStore;
  }

  ngOnInit() {}

  refreshAutocompleteOptions(fullTextQuery: string): void {
    (fullTextQuery?.trim()?.length > 2)
      ? this._accountAutocompleteService.refreshAutocompleteOptions(fullTextQuery, this.accountType)
      : this.accountAutocompleteStore.setValue([]);
  }

}
