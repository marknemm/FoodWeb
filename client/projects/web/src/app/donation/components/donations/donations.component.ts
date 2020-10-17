import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';

@Component({
  selector: 'foodweb-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  private _activeFilters: DonationReadRequest = {};
  private _donations: Donation[] = [];
  private _myDonations = false;
  private _pageTitle = 'Donations';
  private _totalCount = 0;

  constructor(
    public donationHelper: DonationHelper,
    private _activatedRoute: ActivatedRoute,
    private _donationReadService: DonationReadService,
    private _router: Router
  ) {}

  get activeFilters(): DonationReadRequest {
    return this._activeFilters;
  }

  get donations(): Donation[] {
    return this._donations;
  }

  get myDonations(): boolean {
    return this._myDonations;
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    this._pageTitle = (this._myDonations ? 'My Donations' : 'Donations');
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
