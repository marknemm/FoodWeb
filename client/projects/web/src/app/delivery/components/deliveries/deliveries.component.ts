import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryHelper, Donation, DonationHelper, ListResponse } from '~shared';
import { DeliveryService } from '~web/delivery/delivery/delivery.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {

  donations: Donation[] = [];
  totalCount = 0;

  constructor(
    public deliveryHelper: DeliveryHelper,
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _deliveryService: DeliveryService
  ) {}

  ngOnInit() {
    this._deliveryService.listenDeliveriesQueryChange(this._activatedRoute).subscribe(
      (response: ListResponse<Donation>) => {
        this.donations = response.list;
        this.totalCount = response.totalCount;
      }
    );
  }

}
