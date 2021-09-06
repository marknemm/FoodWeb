import { Component } from '@angular/core';
import { Account, AccountReadRequest } from '~shared';
import { AccountListComponent as WebAccountListComponent } from '~web/account/components/account-list/account-list.component';
import { ListResponse } from '~shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'foodweb-hybrid-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent extends WebAccountListComponent {

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.filtersForm.page = event.page;
    this._accountReadService.getAccounts(this.filtersForm.toAccountReadRequest()).subscribe(
      (response: ListResponse<Account>) => {
        if (response?.list) {
          for (const account of response.list) {
            this._accounts.push(account); // Must iteratively add in-place so no blink in ion-virtual-scroll.
          }
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.refresh().subscribe(() => event.target.complete());
  }

  refresh(request?: AccountReadRequest): Observable<Account[]> {
    this.filtersForm.page = 1;
    return super.refresh(request);
  }
}
