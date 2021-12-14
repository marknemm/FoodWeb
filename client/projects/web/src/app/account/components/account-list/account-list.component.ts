import { Component, OnInit } from '@angular/core';
import { Account } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { AccountListLabelService } from '~web/account/services/account-list-label/account-list-label.service';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [AccountListLabelService, ListQueryService]
})
export class AccountListComponent implements OnInit {

  readonly filtersForm = new AccountFiltersForm();

  constructor(
    public accountListLabelService: AccountListLabelService,
    public listQueryService: ListQueryService<Account>,
    private _accountReadService: AccountReadService,
  ) {}

  ngOnInit(): void {
    this.listQueryService.load(this._accountReadService, this.filtersForm);
  }

}
