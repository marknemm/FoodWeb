import { Component } from '@angular/core';
import { Account } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { AccountListLabelService } from '~web/account/services/account-list-label/account-list-label.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [AccountListLabelService, ListQueryService]
})
export class AccountListComponent {

  readonly filtersForm = new AccountFiltersForm();

  constructor(
    public accountListLabelService: AccountListLabelService,
    public listQueryService: ListQueryService<Account>,
    private _accountReadService: AccountReadService,
  ) {}

  ionViewWillEnter(): void {
    this.listQueryService.load(this._accountReadService, this.filtersForm);
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
    this.listQueryService.refresh(false).subscribe(() => event.target.complete());
  }
}
