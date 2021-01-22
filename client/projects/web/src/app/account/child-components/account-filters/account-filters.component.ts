import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountReadRequest, AccountSortBy, AccountType } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { FormBaseComponent, FormHelperService, formProvider } from '~web/forms';

@Component({
  selector: 'foodweb-account-filters',
  templateUrl: './account-filters.component.html',
  styleUrls: ['./account-filters.component.scss'],
  providers: formProvider(AccountFiltersComponent)
})
export class AccountFiltersComponent extends FormBaseComponent<AccountFiltersForm> implements OnInit {

  @Output() clear = new EventEmitter<void>();
  @Output() filter = new EventEmitter<AccountReadRequest>();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  constructor(
    formHelperService: FormHelperService
  ) {
    super(() => new AccountFiltersForm(), formHelperService);
  }

  ngOnInit() {
    // Make sure we update the sort by first option name based on the current accountType filter value.
    this._updateSortByAccountType(this.formGroup.get('accountType').value);
    this.formGroup.onControlValueChanges('accountType').subscribe(
      this._updateSortByAccountType.bind(this)
    );
  }

  /**
   * Updates the sort by first option name based on the account type filter value.
   * @param accountType The current account type filter value.
   */
  private _updateSortByAccountType(accountType: AccountType): void {
    this.sortByOpts[0].name = accountType
      ? (this.formGroup.isVolunteerAccountType ? 'Volunteer Name' : 'Organization Name')
      : 'Organization/Volunteer Name';
  }
}
