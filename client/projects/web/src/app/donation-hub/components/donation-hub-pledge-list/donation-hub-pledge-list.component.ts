import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHubPledge, DonationHubPledgeReadRequest, ListResponse, ReadRequest } from '~shared';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss']
})
export class DonationHubPledgeListComponent implements OnInit {

  private _activeFilters: DonationHubPledgeReadRequest = {};
  private _pledges: DonationHubPledge[] = [];
  private _myPledges = false;
  private _totalCount = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _pledgeReadService: DonationHubPledgeReadService,
    private _router: Router,
    private _urlQueryService: UrlQueryService
  ) {}

  get activeFilters(): DonationHubPledgeReadRequest {
    return this._activeFilters;
  }

  get pledges(): DonationHubPledge[] {
    return this._pledges;
  }

  get myPledges(): boolean {
    return this._myPledges;
  }

  get noneFound(): boolean {
    return (!this._pledgeReadService.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myPledges = this._router.url.indexOf('/my') >= 0;
    this._urlQueryService.listenQueryParamsChange<ReadRequest>(this._activatedRoute).subscribe(
      (request: ReadRequest) => this.handleQueryParamsChanged(request)
    );
  }

  handleQueryParamsChanged(request: ReadRequest): void {
    this._activeFilters = <DonationHubPledgeReadRequest>request;
    this._pledgeReadService.getDonationHubPledges(this.activeFilters).subscribe((response: ListResponse<DonationHubPledge>) => {
      this._pledges = response.list;
      this._totalCount = response.totalCount;
    });
  }
}
