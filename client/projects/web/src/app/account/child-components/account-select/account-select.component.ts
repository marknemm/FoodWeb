import { Component, Input } from '@angular/core';
import { AccountAutocompleteItem, AccountHelper, AccountType, DeepReadonly } from '~shared';
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
export class AccountSelectComponent extends FormComponentBase<AccountAutocompleteItem> {

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

  /**
   * The account autocomplete store which contains account data for the select options.
   */
  get accountAutocompleteStore(): ImmutableStore<AccountAutocompleteItem[]> {
    return this.accountAutocompleteService.accountAutocompleteStore;
  }

  ngOnInit() {
    super.ngOnInit();
    this.syncFilterStr();
  }

  /**
   * Focuses and selects the account filter input field when the select panel is opened.
   */
  onPanelOpened(filterInput: HTMLInputElement): void {
    filterInput.focus();
    filterInput.select();
  }

  /**
   * Synchronizes the account filter string with the set selected account.
   * If the selected account exists in the account autocomplete store data, then the filter is unchanged.
   * If it is not present, then the filter is updated so that the account will be included in the autocomplete store.
   */
  syncFilterStr(): void {
    const selectedAccount: AccountAutocompleteItem = this.formControl.value;

    if (selectedAccount) {
      const foundAccount: boolean = this._setValueToFoundItem(selectedAccount);

      if (!foundAccount) {
        this.filterCtrl.setValue(this.accountHelper.accountName(selectedAccount));
        this.accountAutocompleteService.refreshAutocompleteItems(this.filterCtrl.value, this.accountType).subscribe(
          () => this._setValueToFoundItem(selectedAccount)
        );
      }
    }
  }

  /**
   * Attempts to find a given account autocomplete item. If found, sets the current form control value to it.
   * NOTE: Cannot always set the account to find directly, since its reference may not match the select account options.
   * @param toFind The account autocomplete item that is to be found.
   * @return true if the account autocomplete item was found, false if not.
   */
  private _setValueToFoundItem(toFind: AccountAutocompleteItem): boolean {
    const foundAccount: DeepReadonly<AccountAutocompleteItem> = this.accountAutocompleteStore.value.find(
      (account: DeepReadonly<AccountAutocompleteItem>) => account.id === toFind.id
    );
    if (foundAccount) {
      this.formControl.setValue(foundAccount, { emitEvent: false, emitViewToModelChange: false });
    }
    return !!foundAccount;
  }

}
