import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { AdminAccountMessageForm } from '~admin/admin-account/forms/admin-account-message.form';
import { AdminAccountMessageService } from '~admin/admin-account/services/admin-account-message/admin-account-message.service';
import { AccountReadRequest } from '~shared';
import { AccountFiltersForm } from '~web/account/forms/account-filters.form';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-admin-compose-message',
  templateUrl: './admin-account-message.component.html',
  styleUrls: ['./admin-account-message.component.scss'],
})
export class AdminAccountMessageComponent implements OnInit {

  readonly accountMessageForm = new AdminAccountMessageForm();
  readonly faFlask = faFlask;
  readonly filtersForm = new AccountFiltersForm();

  accountFiltersOpened = false;

  private _activeFilters: AccountReadRequest = {};

  constructor(
    private _accountMessageService: AdminAccountMessageService,
    private _activatedRoute: ActivatedRoute,
    private _pageTitleService: PageTitleService,
    private _urlQueryService: UrlQueryService
  ) {}

  get activeFilters(): AccountReadRequest {
    return this._activeFilters;
  }

  ngOnInit() {
    this._pageTitleService.title = 'Compose Message';
    this._activatedRoute.queryParams.subscribe((params: Params) => this._activeFilters = params);
  }

  sendMessage(): void {
    if (this.accountMessageForm.valid) {
      const accountFilters: AccountReadRequest = this._activatedRoute.snapshot.queryParams;
      this._accountMessageService.sendMessage(this.accountMessageForm.value, accountFilters).subscribe(() => {});
    }
  }

  testMessage(): void {
    this._accountMessageService.testMessage(this.accountMessageForm.value).subscribe(() => {});
  }

  updateFilterQueryParams(filters: AccountReadRequest): void {
    this.accountFiltersOpened = false;
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }
}
