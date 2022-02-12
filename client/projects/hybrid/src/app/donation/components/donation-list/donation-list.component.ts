import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonMenu } from '@ionic/angular';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { Donation, DonationSortBy } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SortByOpt } from '~web/page-list/interfaces/sort-by-opt';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationListComponent {

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

  get addActionRouteSegment(): string {
    return (this._sessionService.isDonor ? 'donate' : 'list');
  }

  get canAccessAddAction(): boolean {
    return (this.myDonations && (this._sessionService.isDonor || this._sessionService.isReceiver));
  }

  get defaultBackHref(): string {
    return (this._sessionService.isVolunteer ? '/delivery' : '..');
  }

  get myDonations(): boolean {
    return this._myDonations;
  }

  get pageTitle(): string {
    return (this.myDonations ? 'My Donations' : 'Donations');
  }

  get showChooseDonation(): boolean {
    return (!this.myDonations && !this.listQueryService.noneFound && this._sessionService.isReceiver);
  }

  constructor(
    public constantsService: ConstantsService,
    public listQueryService: ListQueryService<Donation>,
    private _donationReadService: DonationReadService,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  ionViewWillEnter(): void {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    if (!this.listQueryService.items.length) {
      this.listQueryService.load(
        this._donationReadService.getDonations.bind(this._donationReadService),
        this.filtersForm
      );
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.listQueryService.loadMore().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.listQueryService.refresh({ showLoader: false }).subscribe(() => event.target.complete());
  }

  clearFilters(): void {
    this.filtersForm.resetFacetFilters();
    if (this.filtersForm.valid) {
      this.listQueryService.refresh();
    }
  }

  submitFilters(filterMenu: IonMenu): void {
    if (this.filtersForm.valid) {
      filterMenu.close();
      this.listQueryService.refresh();
    }
  }

}
