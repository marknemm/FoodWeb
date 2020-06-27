import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationHelper, DonationReadRequest, ListResponse } from '~shared';
import { Donation, DonationReadService } from '~web/donation/donation-read/donation-read.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  private _donations: Donation[] = [];
  private _totalCount = 0;

  constructor(
    public donationHelper: DonationHelper,
    public pageTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _donationReadService: DonationReadService,
    private _router: Router
  ) {}

  get donations(): Donation[] {
    return this._donations;
  }

  get totalCount(): number {
    return this._totalCount;
  }

  ngOnInit() {
    this._donationReadService.listenDonationsQueryChange(this._activatedRoute).subscribe(
      (response: ListResponse<Donation>) => {
        this._donations = response.list;
        this._totalCount = response.totalCount;
      }
    );
  }

  filterDonations(filters: DonationReadRequest): void {
    // Convert dates into raw ISO strings.
    Object.keys(filters).forEach((filtKey: string) => {
      if (filters[filtKey] instanceof Date) {
        filters[filtKey] = (<Date>filters[filtKey]).toISOString();
      }
    });

    this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: filters
    });
  }

}
