import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Account, AccountHelper, AccountReadFilters, AccountType, ListResponse } from '~shared';
import { AccountFiltersFormT } from '~web/account/forms/account-filters.form';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  protected _accounts: Account[] = [];
  protected _totalCount = 0;
  protected _activeFilters: AccountReadFilters = {};

  constructor(
    public accountHelper: AccountHelper,
    public pageTitleService: PageTitleService,
    protected _accountReadService: AccountReadService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {}

  get accounts(): Account[] {
    return this._accounts;
  }

  get activeFilters(): AccountReadFilters {
    return this._activeFilters;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._listenAccountsQueryChange();
    this._setPageTitle();
  }

  protected _listenAccountsQueryChange(): void {
    this._activatedRoute.queryParams.pipe(
      switchMap((params: Params) => {
        this._activeFilters = params;
        return this._accountReadService.handleAccountsQueryChange(params);
      })
    ).subscribe((response: ListResponse<Account>) => {
      this._setPageTitle();
      this._accounts = response.list;
      this._totalCount = response.totalCount;
      this._activeFilters = this._activatedRoute.snapshot.queryParams;
    });
  }

  protected _setPageTitle(): void {
    const accountType = <AccountType>this._activatedRoute.snapshot.queryParamMap.get('accountType');
    this.pageTitleService.title = (accountType)
      ? `${accountType}s`
      : 'Accounts';
  }

  filterAccounts(filters: AccountFiltersFormT): void {
    this._accountReadService.updateURLQueryString(filters, this._activatedRoute);
  }

}
