import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService, Account } from '../../services/account/account.service';

@Component({
  selector: 'food-web-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy {

  accounts: Account[] = [];

  private _destroy$ = new Subject();

  constructor(
    private _accountService: AccountService
  ) {}

  ngOnInit() {
    this._accountService.listenAccountsQueryChange().pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      (accounts: Account[]) => this.accounts = accounts
    );
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
