import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountHelper, AccountReadRequest, AccountType, ListResponse } from '~shared';
import { Account, AccountService } from '~web/account/account/account.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  protected _accounts: Account[] = [];
  protected _totalCount = 0;

  constructor(
    public accountHelper: AccountHelper,
    public pageTitleService: PageTitleService,
    protected _accountService: AccountService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {}

  get accounts(): Account[] {
    return this._accounts;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._listenAccountsQueryChange();
    this._setPageTitle();
  }

  protected _listenAccountsQueryChange(): void {
    this._accountService.listenAccountsQueryChange(this._activatedRoute).subscribe(
      (response: ListResponse<Account>) => {
        this._setPageTitle();
        this._accounts = response.list;
        this._totalCount = response.totalCount;
      }
    );
  }

  protected _setPageTitle(): void {
    const accountType = <AccountType>this._activatedRoute.snapshot.queryParamMap.get('accountType');
    this.pageTitleService.title = (accountType)
      ? `${accountType}s`
      : 'Accounts';
  }

  filterAccounts(filters: AccountReadRequest): void {
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: filters
    });
  }

}
