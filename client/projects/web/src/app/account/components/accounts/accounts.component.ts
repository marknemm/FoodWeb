import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountHelper, AccountType, ListResponse } from '~shared';
import { Account, AccountService } from '~web/account/account/account.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  private _accounts: Account[] = [];
  private _totalCount = 0;

  constructor(
    public pageTitleService: PageTitleService,
    public accountHelper: AccountHelper,
    private _accountService: AccountService,
    private _activatedRoute: ActivatedRoute
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

  private _listenAccountsQueryChange(): void {
    this._accountService.listenAccountsQueryChange(this._activatedRoute).subscribe(
      (response: ListResponse<Account>) => {
        this._setPageTitle();
        this._accounts = response.list;
        this._totalCount = response.totalCount;
      }
    );
  }

  private _setPageTitle(): void {
    const accountType = <AccountType>this._activatedRoute.snapshot.queryParamMap.get('accountType');
    this.pageTitleService.title = (accountType)
      ? `${accountType}s`
      : 'Accounts';
  }

}
