import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
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

  protected _myDeliveries = false;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public listQueryService: ListQueryService<Donation>,
    public pageTitleService: PageTitleService,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
  ) {}

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get searchPlaceholder(): string {
    return (this._myDeliveries)
      ? 'Search My Deliveries...'
      : 'Search For Deliveries...';
  }

  ngOnInit(): void {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this.pageTitleService.title = (this._myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    this.listQueryService.load(
      this._deliveryReadService.getMyDeliveries.bind(this._deliveryReadService),
      this.filtersForm
    );
  }

}
