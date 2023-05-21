import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationSortBy } from '~shared';
import { DonationFilterForm, DonationFilterFormAdapter } from '~web/donation-shared/services/donation-filter-form-adapter/donation-filter-form-adapter.service';
import { DonationSortOptionsService } from '~web/donation-shared/services/donation-sort-options/donation-sort-options.service';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SortOption } from '~web/page-list/interfaces/sort-by-opt';
import { SessionService } from '~web/session/services/session/session.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
  providers: [DonationSortOptionsService, ListQueryService]
})
export class DonationListComponent implements OnInit {

  readonly filtersForm: DonationFilterForm = this._donationFilterFormAdapter.toForm();

  private _myDonations = false;

  constructor(
    public constantsService: ConstantsService,
    private _donationFilterFormAdapter: DonationFilterFormAdapter,
    private _donationReadService: DonationReadService,
    private _donationSortOptionsService: DonationSortOptionsService,
    private _listQueryService: ListQueryService<Donation>,
    private _router: Router,
    private _sessionService: SessionService,
    private _shellService: ShellService,
  ) {}

  get donations(): readonly Donation[] {
    return this._listQueryService.items;
  }

  get myDonations(): boolean {
    return this._myDonations;
  }

  get noneFound(): boolean {
    return this._listQueryService.noneFound;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  get showChooseDonation(): boolean {
    return (!this.myDonations && !this._listQueryService.noneFound && this._sessionService.isReceiver);
  }

  get sortOptions(): readonly SortOption<DonationSortBy>[] {
    return this._donationSortOptionsService.options;
  }

  get totalCount(): number {
    return this._listQueryService.totalCount;
  }

  ngOnInit(): void {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    this._listQueryService.load(
      this._donationReadService.getDonations.bind(this._donationReadService),
      this.filtersForm,
      this._donationFilterFormAdapter
    );
  }

  refresh(): void {
    this._listQueryService.refresh();
  }

  resetFacetFilters(): void {
    this.filtersForm.reset({ fullTextQuery: this.filtersForm.controls.fullTextQuery.value });
  }

}
