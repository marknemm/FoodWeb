import { Component } from '@angular/core';
import { Donation, ListResponse } from '~shared';
import { DonationListComponent as WebDonationListComponent } from '~web/donation/components/donation-list/donation-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent extends WebDonationListComponent {

  get loading(): boolean {
    return this._donationReadService.loading;
  }

  get loadMoreDisabled(): boolean {
    return (this.loading || this.donations.length % 10 !== 0);
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation/Delivery List items.
   * @param event The ionRefresh event.
   */
  handleIonRefresh(event: any): void {
    this.filtersForm.get('page').setValue(1);
    this.refresh().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation/Delivery List items.
   * @param event The ionInfinite event.
   */
  handleIonInfinite(event: any): void {
    this.filtersForm.get('page').setValue(this.filtersForm.get('page').value + 1);
    this._donationReadService.getDonations(this.filtersForm.toDonationReadRequest()).subscribe(
      (response: ListResponse<Donation>) => {
        if (response?.list) {
          this._donations.concat(response.list);
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }
}
