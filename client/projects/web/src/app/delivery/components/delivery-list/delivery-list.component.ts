import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, DonationSortBy, DonationStatus } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss'],
  providers: [ListQueryService]
})
export class DeliveryListComponent implements OnInit {

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

  private _donationStatuses: DonationStatus[] = [];
  private _myDeliveries = false;

  constructor(
    public constantsService: ConstantsService,
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public listQueryService: ListQueryService<Donation>,
    public pageTitleService: PageTitleService,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
  ) {}

  get donationStatuses(): DonationStatus[] {
    return this._donationStatuses;
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  ngOnInit(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._donationStatuses = this.constantsService.getDeliveryStatuses(!this.myDeliveries);
    this.pageTitleService.title = (this.myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    this.listQueryService.load(
      this._deliveryReadService.getDeliveries.bind(this._deliveryReadService),
      this.filtersForm
    );
  }

}
