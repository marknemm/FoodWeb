import { Component } from '@angular/core';
import { IonMenu } from '@ionic/angular';
import { Account, AccountSortBy } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { AccountListLabelService } from '~web/account/services/account-list-label/account-list-label.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [AccountListLabelService, ListQueryService]
})
export class AccountListComponent {

  readonly filtersForm = new AccountFiltersForm();

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<AccountSortBy>[] = [
    { name: 'Organization Name', value: 'name' },
    { name: 'Email Address', value: 'email' }
  ];

  constructor(
    public accountListLabelService: AccountListLabelService,
    public constantsService: ConstantsService,
    public listQueryService: ListQueryService<Account>,
    private _accountReadService: AccountReadService,
  ) {}

  ionViewWillEnter(): void {
    if (!this.listQueryService.items?.length) {
      this.listQueryService.load(
        this._accountReadService.getAccounts.bind(this._accountReadService),
        this.filtersForm
      );
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.listQueryService.loadMore().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.listQueryService.refresh({ showLoader: false }).subscribe(() => event.target.complete());
  }

  clearFilters(): void {
    this.filtersForm.resetFacetFilters();
    if (this.filtersForm.valid) {
      this.listQueryService.refresh();
    }
  }

  submitFilters(filterMenu: IonMenu): void {
    if (this.filtersForm.valid) {
      filterMenu.close();
      this.listQueryService.refresh();
    }
  }
}
