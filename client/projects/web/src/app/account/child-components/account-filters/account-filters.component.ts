import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountReadRequest, AccountSortBy, AccountType } from '~shared';
import { AccountFiltersForm } from '~web/account/account-filters.form';
import { SortByOpt } from '~web/filter-list/sort-by-opt';

@Component({
  selector: 'food-web-account-filters',
  templateUrl: './account-filters.component.html',
  styleUrls: ['./account-filters.component.scss'],
})
export class AccountFiltersComponent implements OnInit {

  @Output() filter = new EventEmitter<AccountReadRequest>();

  readonly filtersForm = new AccountFiltersForm();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {}

  get isVolunteerAccountType(): boolean {
    return (this.filtersForm.get('accountType').value === AccountType.Volunteer);
  }

  get isOrganizationAccountType(): boolean {
    const organizationAccountTypes: AccountType[] = [AccountType.Donor, AccountType.Receiver];
    return (organizationAccountTypes.indexOf(this.filtersForm.get('accountType').value) >= 0);
  }

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(
      (filters: Params) => this._refreshActiveFitlers(filters)
    );
  }

  protected _refreshActiveFitlers(filters: Params): void {
    this.filtersForm.patchValue(filters);
    this.sortByOpts[0].name = this.filtersForm.get('accountType').value
      ? (this.isVolunteerAccountType ? 'Volunteer Name' : 'Organization Name')
      : 'Organization/Volunteer Name';
  }

}
