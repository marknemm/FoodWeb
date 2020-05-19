import { Component, Input } from '@angular/core';
import { Account, AccountHelper, AccountType } from '~shared';
import { AccountAutocompleteService } from '~web/account/account-autocomplete/account-autocomplete.service';
import { FormComponentBase, valueAccessorProvider } from '~web/data-structure/form-component-base';
import { ImmutableStore } from '~web/data-structure/immutable-store';
import { TypedFormControl } from '~web/data-structure/typed-form-control';
import { FormHelperService } from '~web/shared/form-helper/form-helper.service';

@Component({
  selector: 'food-web-account-select',
  templateUrl: './account-select.component.html',
  styleUrls: ['./account-select.component.scss'],
  providers: [
    valueAccessorProvider(AccountSelectComponent),
    AccountAutocompleteService,
    FormHelperService
  ]
})
export class AccountSelectComponent extends FormComponentBase<Account> {

  @Input() accountType: AccountType;
  @Input() filterPlaceholder = 'Search Accounts...';
  @Input() placeholder = 'Select an Account';

  readonly filterCtrl = new TypedFormControl<string>();

  constructor(
    public accountHelper: AccountHelper,
    public accountAutocompleteService: AccountAutocompleteService,
    formHelperService: FormHelperService
  ) {
    super(formHelperService);
  }

  get accountAutocompleteStore(): ImmutableStore<Account[]> {
    return this.accountAutocompleteService.accountAutocompleteStore;
  }

  onPanelOpened(filterInput: HTMLInputElement): void {
    filterInput.focus();
    filterInput.select();
  }

}
