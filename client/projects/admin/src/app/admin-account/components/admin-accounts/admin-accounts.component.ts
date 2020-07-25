import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountHelper } from '~shared';
import { AccountReadService } from '~web/account/account-read/account-read.service';
import { AccountsComponent } from '~web/account/accounts/accounts.component';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'foodweb-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: [
    '../../../../../../web/src/app/account/components/accounts/accounts.component.scss',
    './admin-accounts.component.scss'
  ]
})
export class AdminAccountsComponent extends AccountsComponent {

  constructor(
    public accountHelper: AccountHelper,
    public pageTitleService: PageTitleService,
    protected _accountReadService: AccountReadService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router
  ) {
    super(accountHelper, pageTitleService, _accountReadService, _activatedRoute, _router);
  }

}
