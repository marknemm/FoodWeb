import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationSortBy } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
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

  /**
   * Options for sorting dropdown.
   */
  readonly sortByOpts: SortByOpt<DonationSortBy>[] = [
    { name: 'Donation Window', value: 'deliveryWindowStart' },
    { name: 'Date Created', value: 'createTimestamp' },
    { name: 'Donation Status', value: 'donationStatus' },
    { name: 'Donor Organization', value: 'donorOrganizationName' }
  ];

  private _myDonations = false;

  constructor(
    public constantsService: ConstantsService,
    public listQueryService: ListQueryService<Donation>,
    public pageTitleService: PageTitleService,
    private _donationReadService: DonationReadService,
    private _router: Router,
    private _sessionService: SessionService
  ) {}

  get myDonations(): boolean {
    return this._myDonations;
  }

  get showChooseDonation(): boolean {
    return (!this.myDonations && !this.listQueryService.noneFound && this._sessionService.isReceiver);
  }

  ngOnInit(): void {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    this.listQueryService.load(
      this._donationReadService.getDonations.bind(this._donationReadService),
      this.filtersForm
    );
  }
}
