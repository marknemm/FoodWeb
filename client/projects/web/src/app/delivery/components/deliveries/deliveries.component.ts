import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Donation, DonationHelper, ListResponse } from '~shared';
import { DeliveryService } from '~web/delivery/delivery/delivery.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit, OnDestroy {

  donations: Donation[] = [];
  totalCount = 0;

  private _destroy$ = new Subject();

  constructor(
    public pageTitleService: PageTitleService,
    public donationHelper: DonationHelper,
    private _deliveryService: DeliveryService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._deliveryService.listenDeliveriesQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      (response: ListResponse<Donation>) => {
        this.donations = response.list;
        this.totalCount = response.totalCount;
      }
    );
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
