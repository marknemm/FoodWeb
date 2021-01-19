import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  readonly filtersForm = new DonationFiltersForm();

  private _donations: Donation[] = [];
  private _myDonations = false;
  private _totalCount = 0;

  constructor(
    public donationHelper: DonationHelper,
    private _activatedRoute: ActivatedRoute,
    private _donationReadService: DonationReadService,
    private _router: Router,
    private _urlQueryService: UrlQueryService
  ) {}

  get donations(): Donation[] {
    return this._donations;
  }

  get myDonations(): boolean {
    return this._myDonations;
  }

  get noneFound(): boolean {
    return (!this._donationReadService.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    this._urlQueryService.listenQueryParamsChange<DonationReadRequest>(this._activatedRoute).subscribe(
      (request: DonationReadRequest) => this.handleQueryParamsChanged(request)
    );
  }

  updateFilterQueryParams(filters: DonationReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  handleQueryParamsChanged(request: DonationReadRequest): void {
    this.filtersForm.reset(request);
    this._donationReadService.getDonations(request).subscribe((response: ListResponse<Donation>) => {
      this._donations = response.list;
      this._totalCount = response.totalCount;
    });
  }
}
