import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss']
})
export class DonationListComponent implements OnInit {

  readonly filtersForm = new DonationFiltersForm();

  protected _donations: Donation[] = [];
  protected _myDonations = false;
  protected _totalCount = 0;

  constructor(
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationReadService: DonationReadService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
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
      (request: DonationReadRequest) => this.refresh(request).subscribe()
    );
  }

  updateFilterQueryParams(filters: DonationReadRequest): void {
    this._urlQueryService.updateUrlQueryString(filters, this._activatedRoute);
  }

  refresh(request?: DonationReadRequest): Observable<Donation[]> {
    if (request) {
      this.filtersForm.reset(request);
    }

    return this._donationReadService.getDonations(this.filtersForm.toDonationReadRequest()).pipe(
      map((response: ListResponse<Donation>) => {
        if (response) {
          this._donations = response.list;
          this._totalCount = response.totalCount;
        }
        return this._donations;
      })
    );
  }
}
