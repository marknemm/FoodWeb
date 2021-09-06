import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationHubPledge, DonationHubPledgeReadRequest, ListResponse } from '~shared';
import { DonationHubPledgeListComponent as WebDonationHubPledgeListComponent } from '~web/donation-hub/components/donation-hub-pledge-list/donation-hub-pledge-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss']
})
export class DonationHubPledgeListComponent extends WebDonationHubPledgeListComponent {

  get pageTitle(): string {
    return (this._myPledges ? 'My Donations' : 'Donation Pledges');
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub Pledge List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.activeFilters.page = event.page;
    this._pledgeReadService.getDonationHubPledges(this.activeFilters).subscribe(
      (response: ListResponse<DonationHubPledge>) => {
        if (response?.list) {
          for (const pledge of response.list) {
            this._pledges.push(pledge);
          }
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub Pledge List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.refresh().subscribe(() => event.target.complete());
  }

  refresh(request?: DonationHubPledgeReadRequest): Observable<DonationHubPledge[]> {
    this.activeFilters.page = 1;
    return super.refresh(request);
  }
}
