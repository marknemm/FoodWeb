import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { ComposeMessageForm } from '~admin/admin-account/compose-message.form';
import { SendMessageService } from '~admin/admin-account/send-message/send-message.service';
import { AccountReadFilters } from '~shared';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.scss'],
})
export class ComposeMessageComponent implements OnInit {

  readonly composeMessageForm = new ComposeMessageForm();
  readonly faFlask = faFlask;

  accountFiltersOpened = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _pageTitleService: PageTitleService,
    private _router: Router,
    private _sendMessageService: SendMessageService,
  ) {}

  ngOnInit() {
    this._pageTitleService.title = 'Compose Message';
  }

  sendMessage(): void {
    if (this.composeMessageForm.valid) {
      const accountFilters: AccountReadFilters = this._activatedRoute.snapshot.queryParams;
      this._sendMessageService.sendMessage(this.composeMessageForm.value, accountFilters).subscribe(() => {});
    }
  }

  testMessage(): void {
    this._sendMessageService.testMessage(this.composeMessageForm.value).subscribe(() => {});
  }

  updateAccountFilters(filters: AccountReadFilters): void {
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: filters
    });
    this.accountFiltersOpened = false;
  }

}
