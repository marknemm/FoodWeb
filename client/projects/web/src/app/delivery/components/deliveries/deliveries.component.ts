import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DeliveryReadService } from '~web/delivery/delivery-read/delivery-read.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'foodweb-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  filtersPanelOpened = false;

  private _activeFilters: DonationReadRequest = {};
  private _donations: Donation[] = [];
  private _myDeliveries = false;
  private _totalCount = 0;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _deliveryReadService: DeliveryReadService,
    private _router: Router
  ) {}

  get activeFilters(): DonationReadRequest {
    return this._activeFilters;
  }

  get donations(): Donation[] {
    return this._donations;
  }

  get myDeliveries(): boolean {
    return this._myDeliveries;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDeliveries = this._router.url.indexOf('/my') >= 0;
    this._activatedRoute.queryParams.pipe(
      switchMap((params: Params) => {
        this._activeFilters = params;
        return this._deliveryReadService.handleDeliveriesQueryChange(params);
      })
    ).subscribe((response: ListResponse<Donation>) => {
      this._donations = response.list;
      this._totalCount = response.totalCount;
    });
  }

  filterDeliveries(filters: DonationReadRequest): void {
    this._deliveryReadService.updateURLQueryString(filters, this._activatedRoute);
  }

}
