import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { DonationListComponent as WebDonationListComponent } from '~web/donation/components/donation-list/donation-list.component';

@Component({
  selector: 'foodweb-hybrid-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent extends WebDonationListComponent {

  get pageTitle(): string {
    return (this.myDonations ? 'My Donations' : 'Donations');
  }

  get canAccessAddAction(): boolean {
    return (this.myDonations && (this._sessionService.isDonor || this._sessionService.isReceiver));
  }

  get addActionRouteSegment(): string {
    return (this._sessionService.isDonor ? 'donate' : 'list');
  }

  get showChooseDonation(): boolean {
    return (!this.myDonations && !this.noneFound && this._sessionService.isReceiver);
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation/Delivery List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.filtersForm.page = event.page;
    this._donationReadService.getDonations(this.filtersForm.toDonationReadRequest()).subscribe(
      (response: ListResponse<Donation>) => {
        if (response?.list) {
          for (const donation of response.list) {
            this._donations.push(donation); // Must iteratively add in-place so no blink in ion-virtual-scroll.
          }
          this._totalCount = response.totalCount;
        }
        event.target.complete();
      }
    );
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation/Delivery List items.
   * @param event The ionRefresh event.
   */
   handleRefresh(event: any): void {
    this.refresh().subscribe(() => event.target.complete());
  }

  refresh(request?: DonationReadRequest): Observable<Donation[]> {
    this.filtersForm.page = 1;
    return super.refresh(request);
  }
}
