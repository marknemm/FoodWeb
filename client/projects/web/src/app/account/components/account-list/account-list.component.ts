import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, AccountHelper, AccountReadRequest, AccountType, ListResponse } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  protected _accounts: Account[] = [];
  protected _accountType: AccountType;
  protected _totalCount = 0;

  readonly filtersForm = new AccountFiltersForm();

  constructor(
    public accountHelper: AccountHelper,
    public pageTitleService: PageTitleService,
    protected _accountReadService: AccountReadService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
  ) {}

  get accounts(): Account[] {
    return this._accounts;
  }

  get searchPlaceholder(): string {
    return (this._accountType)
      ? `Search ${this._accountType}s...`
      : 'Search Accounts...';
  }

  get noneFound(): boolean {
    return (!this._accountReadService.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._setPageTitle();
    this._urlQueryService.listenQueryParamsChange<AccountReadRequest>(this._activatedRoute).subscribe(
      (request: AccountReadRequest) => {
        this._accountType = request.accountType;
        this.handleQueryParamsChanged(request);
      }
    );
  }

  updateFilterQueryParams(filters: AccountReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  handleQueryParamsChanged(request: AccountReadRequest): void {
    this.filtersForm.reset(request);
    this._accountReadService.getAccounts(request).subscribe((response: ListResponse<Account>) => {
      this._setPageTitle();
      if (response) {
        this._accounts = response.list;
        this._totalCount = response.totalCount;
      }
    });
  }

  protected _setPageTitle(): void {
    const accountType = <AccountType>this._activatedRoute.snapshot.queryParamMap.get('accountType');
    this.pageTitleService.title = (accountType ? `${accountType}s` : 'Accounts');
  }
}
