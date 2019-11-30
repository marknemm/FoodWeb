import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DonationHelper, ListResponse } from '~shared';
import { Donation, DonationService } from '~web/donation/donation/donation.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit, OnDestroy {

  donations: Donation[] = [];
  totalCount = 0;

  private _destroy$ = new Subject();

  constructor(
    public pageTitleService: PageTitleService,
    public donationHelper: DonationHelper,
    private _donationService: DonationService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._donationService.listenDonationsQueryChange(this._activatedRoute).pipe(
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
