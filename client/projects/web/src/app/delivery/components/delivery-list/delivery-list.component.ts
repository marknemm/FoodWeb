import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryHelper, Donation, DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DeliveryReadService } from '~web/delivery/services/delivery-read/delivery-read.service';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements OnInit {

  readonly filtersForm = new DonationFiltersForm();

  protected _donations: Donation[] = [];
  protected _myDeliveries = false;
  protected _totalCount = 0;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _deliveryReadService: DeliveryReadService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
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

  get searchPlaceholder(): string {
    return (this._myDeliveries)
      ? 'Search My Deliveries...'
      : 'Search For Deliveries...';
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this.pageTitleService.title = (this._myDeliveries)
      ? 'My Deliveries'
      : 'Schedule Deliveries';
    this._urlQueryService.listenQueryParamsChange<DonationReadRequest>(this._activatedRoute).subscribe(
      (request: DonationReadRequest) => this.refresh(request).subscribe()
    );
  }

  updateFilterQueryParams(filters: DonationReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  refresh(request?: DonationReadRequest): Observable<Donation[]> {
    if (request) {
      this.filtersForm.reset(request);
    }

    return this._deliveryReadService.getDeliveries(this.filtersForm.toDonationReadRequest()).pipe(
      map((response: ListResponse<Donation>) => {
        if (response?.list) {
          this._donations = response.list;
          this._totalCount = response.totalCount;
        }
        return this._donations;
      })
    );
  }
}
