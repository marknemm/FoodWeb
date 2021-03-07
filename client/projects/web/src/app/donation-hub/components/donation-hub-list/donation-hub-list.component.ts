import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHub, DonationHubReadRequest, ListResponse, ReadRequest } from '~shared';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

/**
 * A list of donation hub drop-off point teasers.
 */
@Component({
  selector: 'foodweb-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss']
})
export class DonationHubListComponent implements OnInit {

  private _activeFilters: DonationHubReadRequest = {};
  private _donationHubs: DonationHub[] = [];
  private _myDonationHubs = false;
  private _totalCount = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _donationHubReadService: DonationHubReadService,
    private _router: Router,
    private _urlQueryService: UrlQueryService
  ) {}

  get activeFilters(): DonationHubReadRequest {
    return this._activeFilters;
  }

  get donationHubs(): DonationHub[] {
    return this._donationHubs;
  }

  get myDonationHubs(): boolean {
    return this._myDonationHubs;
  }

  get noneFound(): boolean {
    return (!this._donationHubReadService.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDonationHubs = this._router.url.indexOf('/my') >= 0;
    this._urlQueryService.listenQueryParamsChange<ReadRequest>(this._activatedRoute).subscribe(
      (request: ReadRequest) => this.handleQueryParamsChanged(request)
    );
  }

  handleQueryParamsChanged(request: ReadRequest): void {
    this._activeFilters = <DonationHubReadRequest>request;
    this._activeFilters.excludeMyHubs = !this.myDonationHubs;
    this._donationHubReadService.getDonationHubs(this.activeFilters).subscribe((response: ListResponse<DonationHub>) => {
      this._donationHubs = response.list;
      this._totalCount = response.totalCount;
    });
  }
}
