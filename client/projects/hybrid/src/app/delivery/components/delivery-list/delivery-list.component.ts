import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Donation, DonationReadRequest, ListResponse } from '~shared';
import { DeliveryListComponent as WebDeliveryListComponent } from '~web/delivery/components/delivery-list/delivery-list.component';

@Component({
  selector: 'foodweb-hybrid-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent extends WebDeliveryListComponent {

  /**
   * Handles an ionInfinite event by loading the next segment of Donation/Delivery List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.filtersForm.page = event.page;
    this._deliveryReadService.getDeliveries(this.filtersForm.toDonationReadRequest()).subscribe(
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
