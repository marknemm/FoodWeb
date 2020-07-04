import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { AdminAccountMessageService } from '~admin/admin-account/admin-account-message/admin-account-message.service';
import { AdminAccountMessageForm } from '~admin/admin-account/admin-account-message.form';
import { AccountReadFilters } from '~shared';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-compose-message',
  templateUrl: './admin-account-message.component.html',
  styleUrls: ['./admin-account-message.component.scss'],
})
export class AdminAccountMessageComponent implements OnInit {

  readonly accountMessageForm = new AdminAccountMessageForm();
  readonly faFlask = faFlask;

  accountFiltersOpened = false;

  constructor(
    private _accountMessageService: AdminAccountMessageService,
    private _activatedRoute: ActivatedRoute,
    private _pageTitleService: PageTitleService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Compose Message';
  }

  sendMessage(): void {
    if (this.accountMessageForm.valid) {
      const accountFilters: AccountReadFilters = this._activatedRoute.snapshot.queryParams;
      this._accountMessageService.sendMessage(this.accountMessageForm.value, accountFilters).subscribe(() => {});
    }
  }

  testMessage(): void {
    this._accountMessageService.testMessage(this.accountMessageForm.value).subscribe(() => {});
  }

  updateAccountFilters(filters: AccountReadFilters): void {
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: filters
    });
    this.accountFiltersOpened = false;
  }

}
