import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { Donation, DonationSortBy, DonationStatus } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  providers: [ListQueryService]
})
export class DeliveryListComponent {

  readonly filtersForm = new DonationFiltersForm();

  /**
   * Options for sorting dropdown.
   */
   readonly sortByOpts: SortByOpt<DonationSortBy>[] = [
    { name: 'Delivery Window', value: 'deliveryWindowStart' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' },
    { name: 'Receiver Organization', value: 'receiverOrganizationName' }
  ];

  private _myDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public listQueryService: ListQueryService<Donation>,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  get defaultBackHref(): string {
    return (this._sessionService.isVolunteer ? '..' : '/donation');
  }

  get isScheduleList(): boolean {
    return (this.filtersForm.get('donationStatus').value === DonationStatus.Matched);
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get pageTitle(): string {
    return (this._myDeliveries)
      ? 'My Deliveries'
      : (this.isScheduleList)
        ? 'Schedule Deliveries'
        : 'Deliveries';
  }

  ionViewWillEnter(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
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

  clearFilters(): void {
    this.filtersForm.resetFacetFilters();
    if (this.filtersForm.valid) {
      this.listQueryService.refresh();
    }
  }

  submitFilters(filterMenu: IonMenu): void {
    if (this.filtersForm.valid) {
      filterMenu.close();
      this.listQueryService.refresh();
    }
  }
}
