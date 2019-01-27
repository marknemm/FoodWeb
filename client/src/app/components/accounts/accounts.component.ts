import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService, Account } from '../../services/account/account.service';
import { PageTitleService } from '../../services/page-title/page-title.service';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';

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
    private _accountService: AccountService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._accountService.listenAccountsQueryChange().pipe(
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

}
