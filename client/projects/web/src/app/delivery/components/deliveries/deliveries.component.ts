import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  readonly filtersForm = new DonationFiltersForm();

  private _donations: Donation[] = [];
  private _myDeliveries = false;
  private _totalCount = 0;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    private _activatedRoute: ActivatedRoute,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router,
    private _urlQueryService: UrlQueryService
  ) {}

  get donations(): Donation[] {
    return this._donations;
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get noneFound(): boolean {
    return (!this._deliveryReadService.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._urlQueryService.listenQueryParamsChange<DonationReadRequest>(this._activatedRoute).subscribe(
      (request: DonationReadRequest) => this.handleQueryParamsChanged(request)
    );
  }

  updateFilterQueryParams(filters: DonationReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  handleQueryParamsChanged(request: DonationReadRequest): void {
    this.filtersForm.reset(request);
    this._deliveryReadService.getDeliveries(request).subscribe((response: ListResponse<Donation>) => {
      this._donations = response.list;
      this._totalCount = response.totalCount;
    });
  }
}
