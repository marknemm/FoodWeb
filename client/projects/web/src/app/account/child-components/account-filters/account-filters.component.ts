import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountReadRequest, AccountSortBy, AccountType } from '~shared';
import { AccountFiltersForm, AccountFiltersFormValue } from '~web/account/account-filters.form';
import { SortByOpt } from '~web/filtered-list/sort-by-opt';

@Component({
  selector: 'food-web-account-filters',
  templateUrl: './account-filters.component.html',
  styleUrls: ['./account-filters.component.scss'],
})
export class AccountFiltersComponent implements OnInit, OnChanges {

  @Input() activeFilters: AccountFiltersFormValue = {};

  @Output() filter = new EventEmitter<AccountReadRequest>();

  readonly filtersForm = new AccountFiltersForm();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  constructor() {}

  get isDonorAccountType(): boolean {
    return (this.filtersForm.get('accountType').value === AccountType.Donor);
  }

  get isReceiverAccountType(): boolean {
    return (this.filtersForm.get('accountType').value === AccountType.Receiver);
  }

  get isVolunteerAccountType(): boolean {
    return (this.filtersForm.get('accountType').value === AccountType.Volunteer);
  }

  get isOrganizationAccountType(): boolean {
    return (this.isDonorAccountType || this.isReceiverAccountType);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.activeFilters) {
      this.filtersForm.patchValue(this.activeFilters);
      this.sortByOpts[0].name = this.filtersForm.get('accountType').value
        ? (this.isVolunteerAccountType ? 'Volunteer Name' : 'Organization Name')
        : 'Organization/Volunteer Name';
    }
  }

}
