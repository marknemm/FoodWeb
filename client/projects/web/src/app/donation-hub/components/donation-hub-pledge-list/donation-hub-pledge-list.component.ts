import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DonationHubPledge, DonationHubPledgeReadRequest, ListResponse } from '~shared';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss']
})
export class DonationHubPledgeListComponent implements OnInit {

  protected _activeFilters: DonationHubPledgeReadRequest = {};
  protected _pledges: DonationHubPledge[] = [];
  protected _myPledges = false;
  protected _totalCount = 0;

  constructor(
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _pledgeReadService: DonationHubPledgeReadService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
  ) {}

  get activeFilters(): DonationHubPledgeReadRequest {
    return this._activeFilters;
  }

  get loading(): boolean {
    return this._pledgeReadService.loading;
  }

  get pledges(): DonationHubPledge[] {
    return this._pledges;
  }

  get myPledges(): boolean {
    return this._myPledges;
  }

  get noneFound(): boolean {
    return (!this.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myPledges = this._router.url.indexOf('/my') >= 0;
    this.pageTitleService.title = (this._myPledges)
      ? 'My Donation Pledges'
      : 'Donation Pledges';
    this._urlQueryService.listenQueryParamsChange<DonationHubPledgeReadRequest>(this._activatedRoute).subscribe(
      (request: DonationHubPledgeReadRequest) => this.refresh(request).subscribe()
    );
  }

  /**
   * Refreshes the Donation Hub Pledge List items.
   * @param request The optional Read Request, contianing filter/sorting parameters.
   * If not given, will use the last recorded Read Request parameters.
   * @returns An observable that emits the loaded `DonationHubPledge` items.
   */
  refresh(request?: DonationHubPledgeReadRequest): Observable<DonationHubPledge[]> {
    this._activeFilters = request ?? this._activeFilters;
    return this._pledgeReadService.getDonationHubPledges(this.activeFilters).pipe(
      map((response: ListResponse<DonationHubPledge>) => {
        this._pledges = response.list;
        this._totalCount = response.totalCount;
        return this._pledges;
      })
    );
  }
}
