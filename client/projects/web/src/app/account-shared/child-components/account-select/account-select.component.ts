import { Component, Input, OnInit } from '@angular/core';
import { FloatLabelType } from '@angular/material/form-field';
import { AccountAutocompleteItem, AccountHelper, AccountType, DeepReadonly } from '~shared';
import { AccountAutocompleteService } from '~web/account-shared/services/account-autocomplete/account-autocomplete.service';
import { FormBaseComponent, FormHelperService, formProvider, TFormControl } from '~web/forms';
import { ImmutableStore } from '~web/shared/classes/immutable-store';

@Component({
  selector: 'foodweb-account-select',
  templateUrl: './account-select.component.html',
  styleUrls: ['./account-select.component.scss'],
  providers: formProvider(AccountSelectComponent).concat([AccountAutocompleteService])
})
export class AccountSelectComponent extends FormBaseComponent<AccountAutocompleteItem> implements OnInit {

  @Input() accountType: AccountType;
  @Input() filterPlaceholder = 'Search Accounts...';
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() placeholder = 'Select an Account';

  readonly filterCtrl = new TFormControl<string>();

  constructor(
    public accountHelper: AccountHelper,
    public accountAutocompleteService: AccountAutocompleteService,
    formHelperService: FormHelperService
  ) {
    super(() => new TFormControl<AccountAutocompleteItem>(), formHelperService);
  }

  /**
   * The account autocomplete store which contains account data for the select options.
   */
  get accountAutocompleteStore(): ImmutableStore<AccountAutocompleteItem[]> {
    return this.accountAutocompleteService.accountAutocompleteStore;
  }

  ngOnInit() {
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
        // Immediately add missing selectedAccount to the autocomplete store so that it can be properly selected.
        this.accountAutocompleteStore.getMutableValue().push(selectedAccount);
        // Must set again so that underlying select control can select newly added autocomplete store option.
        this.formControl.setValue(selectedAccount);
        this.filterCtrl.setValue(this.accountHelper.accountName(selectedAccount));
        // Query the server for the total set of autocomplete entries.
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
