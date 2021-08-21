import { Component } from '@angular/core';
import { DonationHubPledgeListComponent as WebDonationHubPledgeListComponent } from '~web/donation-hub/components/donation-hub-pledge-list/donation-hub-pledge-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss']
})
export class DonationHubPledgeListComponent extends WebDonationHubPledgeListComponent {

  private _page = 0;

  get loading(): boolean {
    return this._pledgeReadService.loading;
  }

  get loadMoreDisabled(): boolean {
    return (this.loading || this.pledges.length % 10 !== 0);
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation Hub Pledge List items.
   * @param event The ionRefresh event.
   */
   handleIonRefresh(event: any): void {
    this._page = 0;
    this.refresh().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation Hub Pledge List items.
   * @param event The ionInfinite event.
   */
  handleIonInfinite(event: any): void {
    this.activeFilters.page = ++this._page;
    this._pledgeReadService.getDonationHubPledges(this.activeFilters).subscribe(
      () => event.target.complete()
    );
  }
}
