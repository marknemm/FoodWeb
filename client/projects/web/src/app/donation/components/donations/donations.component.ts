import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { Donation, DonationReadService } from '~web/donation/donation-read/donation-read.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  private _activeFilters: DonationReadRequest = {};
  private _donations: Donation[] = [];
  private _totalCount = 0;

  constructor(
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _donationReadService: DonationReadService
  ) {}

  get activeFilters(): DonationReadRequest {
    return this._activeFilters;
  }

  get donations(): Donation[] {
    return this._donations;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._activatedRoute.queryParams.pipe(
      switchMap((params: Params) => {
        this._activeFilters = params;
        return this._donationReadService.handleDonationsQueryChange(params);
      })
    ).subscribe((response: ListResponse<Donation>) => {
      this._donations = response.list;
      this._totalCount = response.totalCount;
    });
  }

  filterDonations(filters: DonationReadRequest): void {
    this._donationReadService.updateURLQueryString(filters, this._activatedRoute);
  }

}
