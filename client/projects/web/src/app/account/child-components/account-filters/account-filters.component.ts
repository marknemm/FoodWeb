import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountReadRequest, AccountSortBy } from '~shared';
import { AccountFiltersForm } from '~web/account/account-filters.form';
import { SortByOpt } from '~web/filter-list/sort-by-opt';

@Component({
  selector: 'food-web-account-filters',
  templateUrl: './account-filters.component.html',
  styleUrls: ['./account-filters.component.scss'],
})
export class AccountFiltersComponent implements OnInit {

  @Output() filter = new EventEmitter<AccountReadRequest>();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  readonly filtersForm = new AccountFiltersForm();

  constructor(
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._activatedRoute.queryParams.subscribe((currentFilters: Params) =>
      this.filtersForm.patchValue(currentFilters)
    );
  }

}
