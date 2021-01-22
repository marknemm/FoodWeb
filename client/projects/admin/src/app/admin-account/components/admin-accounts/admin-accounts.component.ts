import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountHelper } from '~shared';
import { AccountsComponent } from '~web/account/components/accounts/accounts.component';
import { AccountReadService } from '~web/account/services/account-read/account-read.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.scss']
})
export class AdminAccountsComponent extends AccountsComponent {

  constructor(
    public accountHelper: AccountHelper,
    protected _accountReadService: AccountReadService,
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
  ) {
    super(accountHelper, _accountReadService, _activatedRoute, _router, _urlQueryService);
  }
}
