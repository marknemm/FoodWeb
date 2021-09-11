import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AccountReadRequest, AccountSortBy, AccountType } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { SortByOpt } from '~web/filtered-list/interfaces/sort-by-opt';
import { FormFieldService } from '~web/forms';

@Component({
  selector: 'foodweb-account-filters',
  templateUrl: './account-filters.component.html',
  styleUrls: ['./account-filters.component.scss'],
  providers: [FormFieldService]
})
export class AccountFiltersComponent implements OnInit {

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
    private _formFieldService: FormFieldService<AccountFiltersForm>
  ) {}

  get filtersForm(): AccountFiltersForm {
    return this._formFieldService.control;
  }

  ngOnInit(): void {
    this._formFieldService.injectControl({
      genDefault: () => new AccountFiltersForm()
    });

    // Make sure we update the sort by first option name based on the current accountType filter value.
    this._updateSortByAccountType(this.filtersForm.get('accountType').value);
    this.filtersForm.get('accountType').valueChanges.pipe(
      takeUntil(this._formFieldService.destroy$)
    ).subscribe(
      this._updateSortByAccountType.bind(this)
    );
  }

  /**
   * Updates the sort by first option name based on the account type filter value.
   * @param accountType The current account type filter value.
   */
  private _updateSortByAccountType(accountType: AccountType): void {
    this.sortByOpts[0].name = accountType
      ? (this.filtersForm.isVolunteerAccountType ? 'Volunteer Name' : 'Organization Name')
      : 'Organization/Volunteer Name';
  }
}
