import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DonationHub, DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
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

  protected _activeFilters: DonationHubReadRequest = { page: 1 };
  protected _donationHubs: DonationHub[] = [];
  protected _myDonationHubs = false;
  protected _totalCount = 0;

  constructor(
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationHubReadService: DonationHubReadService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
  ) {}

  get activeFilters(): DonationHubReadRequest {
    return this._activeFilters;
  }

  get donationHubs(): DonationHub[] {
    return this._donationHubs;
  }

  get loading(): boolean {
    return this._donationHubReadService.loading;
  }

  get myDonationHubs(): boolean {
    return this._myDonationHubs;
  }

  get noneFound(): boolean {
    return (!this.loading && this.totalCount === 0);
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._myDonationHubs = (this._router.url.indexOf('/my') >= 0);
    this.pageTitleService.title = (this._myDonationHubs)
      ? 'My Donation Hubs'
      : 'Pledge Donation';
    this._urlQueryService.listenQueryParamsChange<DonationHubReadRequest>(this._activatedRoute).subscribe(
      (request: DonationHubReadRequest) => this.refresh(request).subscribe()
    );
  }

  /**
   * Refreshes the Donation Hub List items.
   * @param request The optional Read Request, contianing filter/sorting parameters.
   * If not given, will use the last recorded Read Request parameters.
   * @returns An observable that emits the loaded `DonationHub` items.
   */
  refresh(request?: DonationHubReadRequest): Observable<DonationHub[]> {
    this._activeFilters = request ?? this._activeFilters;
    return this._donationHubReadService.getDonationHubs(this.activeFilters).pipe(
      map((response: ListResponse<DonationHub>) => {
        this._donationHubs = response.list;
        this._totalCount = response.totalCount;
        return this._donationHubs;
      })
    );
  }
}
