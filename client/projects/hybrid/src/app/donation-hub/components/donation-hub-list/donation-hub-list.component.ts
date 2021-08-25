import { Component } from '@angular/core';
import { DonationHubListComponent as WebDonationHubListComponent } from '~web/donation-hub/components/donation-hub-list/donation-hub-list.component';
import { DonationHub, ListResponse } from '../../../../../../../../shared/src/web';

@Component({
  selector: 'foodweb-hybrid-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss']
})
export class DonationHubListComponent extends WebDonationHubListComponent {

  get loading(): boolean {
    return this._donationHubReadService.loading;
  }

  get loadMoreDisabled(): boolean {
    return (this.loading || this.donationHubs.length % 10 !== 0);
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub List items.
   * @param event The ionRefresh event.
   */
  handleIonRefresh(event: any): void {
    this.activeFilters.page = 1;
    this.refresh().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleIonInfinite(event: any): void {
    this.activeFilters.page++;
    this._donationHubReadService.getDonationHubs(this.activeFilters).subscribe(
      (response: ListResponse<DonationHub>) => {
        if (response?.list) {
          this._donationHubs.concat(response.list);
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }
}
