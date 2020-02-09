import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DeliveryService } from '~web/delivery/delivery/delivery.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  filtersPanelOpened = false;

  private _donations: Donation[] = [];
  private _myDeliveries = false;
  private _totalCount = 0;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _deliveryService: DeliveryService,
    private _router: Router
  ) {}

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
    this._deliveryService.listenDeliveriesQueryChange(this._activatedRoute).subscribe(
      (response: ListResponse<Donation>) => {
        this._donations = response.list;
        this._totalCount = response.totalCount;
      }
    );
  }

  filterDeliveries(filters: DonationReadRequest): void {
    this.filtersPanelOpened = false;
    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: filters
    });
  }

}
