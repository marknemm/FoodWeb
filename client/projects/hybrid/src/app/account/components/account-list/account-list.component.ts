import { Component } from '@angular/core';
import { Account } from '~shared';
import { AccountListComponent as WebAccountListComponent } from '~web/account/components/account-list/account-list.component';
import { ListResponse } from '../../../../../../../../shared/src/web';

@Component({
  selector: 'foodweb-hybrid-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent extends WebAccountListComponent {

  get loading(): boolean {
    return this._accountReadService.loading;
  }

  get loadMoreDisabled(): boolean {
    return (this.loading || this.accounts.length % 10 !== 0);
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleIonRefresh(event: any): void {
    this.filtersForm.get('page').setValue(0);
    this.refresh().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleIonInfinite(event: any): void {
    this.filtersForm.get('page').setValue(this.filtersForm.get('page').value + 1);
    this._accountReadService.getAccounts(this.filtersForm.toAccountReadRequest()).subscribe(
      (response: ListResponse<Account>) => {
        if (response?.list) {
          this._accounts.concat(response.list);
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }
}
