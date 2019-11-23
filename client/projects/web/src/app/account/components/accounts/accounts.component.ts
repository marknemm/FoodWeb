import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageTitleService } from '~web/page-title/page-title.service';
import { AccountHelper, ListResponse } from '~shared';

import { AccountService, Account } from '~web/account/account.service';

@Component({
  selector: 'food-web-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {

  accounts: Account[] = [];
  totalCount = 0;

  private _destroy$ = new Subject();

  constructor(
    public pageTitleService: PageTitleService,
    public accountHelper: AccountHelper,
    private _accountService: AccountService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._accountService.listenAccountsQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      (response: ListResponse<Account>) => {
        this.accounts = response.list;
        this.totalCount = response.totalCount;
      }
    );
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  getAccountTitle(account: Account): string  {
    return (account.accountType === 'Volunteer')
      ? `${account.volunteer.firstName} ${account.volunteer.lastName}`
      : account.organization.organizationName
  }

}