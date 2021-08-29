import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  get loading(): boolean {
    return this._accountReadService.loading;
  }

  get noneFound(): boolean {
    return (!this.loading && this.totalCount === 0);
  }

  get searchPlaceholder(): string {
    return (this._accountType)
      ? `Search ${this._accountType}s...`
      : 'Search Accounts...';
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._setPageTitle();
    this._urlQueryService.listenQueryParamsChange<AccountReadRequest>(this._activatedRoute).subscribe(
      (request: AccountReadRequest) => {
        this._accountType = request.accountType;
        this.refresh(request).subscribe();
      }
    );
  }

  updateFilterQueryParams(filters: AccountReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  /**
   * Refreshes the Account List items.
   * @param request The optional Read Request, contianing filter/sorting parameters.
   * If not given, will use the last recorded Read Request parameters.
   * @returns An observable that emits the loaded `Account` items.
   */
  refresh(request?: AccountReadRequest): Observable<Account[]> {
    if (request) {
      this.filtersForm.reset(request);
    }

    return this._accountReadService.getAccounts(this.filtersForm.toAccountReadRequest()).pipe(
      map((response: ListResponse<Account>) => {
        this._setPageTitle();
        if (response) {
          this._accounts = response.list;
          this._totalCount = response.totalCount;
        }
        return this._accounts;
      })
    );
  }

  protected _setPageTitle(): void {
    const accountType = <AccountType>this._activatedRoute.snapshot.queryParamMap.get('accountType');
    this.pageTitleService.title = (accountType ? `${accountType}s` : 'Accounts');
  }
}