import { Component, OnInit } from '@angular/core';
import { Account } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { AccountListLabelService } from '~web/account/services/account-list-label/account-list-label.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { AccountSortOptionsService } from '~web/account/services/account-sort-options/account-sort-options.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [AccountListLabelService, AccountSortOptionsService, ListQueryService]
})
export class AccountListComponent implements OnInit {

  readonly filtersForm = new AccountFiltersForm();

  constructor(
    public accountListLabelService: AccountListLabelService,
    public accountSortOptionsService: AccountSortOptionsService,
    public listQueryService: ListQueryService<Account>,
    private _accountReadService: AccountReadService,
  ) {}

  ngOnInit(): void {
    this.listQueryService.load(
      this._accountReadService.getAccounts.bind(this._accountReadService),
      this.filtersForm
    );
  }

}
