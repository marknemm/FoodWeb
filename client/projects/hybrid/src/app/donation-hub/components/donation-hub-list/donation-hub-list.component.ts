import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHub, DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubListComponent as WebDonationHubListComponent } from '~web/donation-hub/components/donation-hub-list/donation-hub-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss']
})
export class DonationHubListComponent extends WebDonationHubListComponent {

  get pageTitle(): string {
    return (this._myDonationHubs ? 'My Donation Hubs' : 'Donation Hubs');
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.activeFilters.page = event.page;
    this._donationHubReadService.getDonationHubs(this.activeFilters).subscribe(
      (response: ListResponse<DonationHub>) => {
        if (response?.list) {
          for (const donationHub of response.list) {
            this._donationHubs.push(donationHub);
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

  refresh(request?: DonationHubReadRequest): Observable<DonationHub[]> {
    this.activeFilters.page = 1;
    return super.refresh(request);
  }
}
