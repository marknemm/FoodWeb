import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Donation } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  providers: [ListQueryService]
})
export class DeliveryListComponent {

  readonly filtersForm = new DonationFiltersForm();

  private _myDeliveries = false;
  private _pageTitle = '';

  constructor(
    public listQueryService: ListQueryService<Donation>,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router
  ) {}

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  ionViewWillEnter(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._pageTitle = (this._myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    if (!this.listQueryService.items.length) {
      this.listQueryService.load(
        this._deliveryReadService.getDeliveries.bind(this._deliveryReadService),
        this.filtersForm
      );
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation/Delivery List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.listQueryService.loadMore().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation/Delivery List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.listQueryService.refresh({ showLoader: false }).subscribe(() => event.target.complete());
  }
}
