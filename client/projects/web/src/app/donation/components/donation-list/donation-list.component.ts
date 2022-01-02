import { Component, OnInit } from '@angular/core';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationListComponent implements OnInit {

  readonly filtersForm = new DonationFiltersForm();

  constructor(
    public listQueryService: ListQueryService<Donation>,
    public pageTitleService: PageTitleService,
    private _donationReadService: DonationReadService,
  ) {}

  ngOnInit(): void {
    this.listQueryService.load(
      this._donationReadService.getDonations.bind(this._donationReadService),
      this.filtersForm
    );
  }
}
