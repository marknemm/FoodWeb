import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountHelper } from '~shared';
import { AccountService } from '~web/account/account/account.service';
import { AccountsComponent } from '~web/account/accounts/accounts.component';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: [
    '../../../../../../web/src/app/account/components/accounts/accounts.component.scss',
    './admin-accounts.component.scss'
  ]
})
export class AdminAccountsComponent extends AccountsComponent implements OnInit {

  constructor(
    public accountHelper: AccountHelper,
    public pageTitleService: PageTitleService,
    protected _accountService: AccountService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {
    super(accountHelper, pageTitleService, _accountService, _activatedRoute, _router);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
