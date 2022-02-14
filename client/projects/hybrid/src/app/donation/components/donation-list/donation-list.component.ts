import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '~hybrid/session/services/session/session.service';
import { Donation } from '~shared';
import { DonationFiltersForm } from '~web/donation-shared/forms/donation-filters.form';
import { DonationSortOptionsService } from '~web/donation-shared/services/donation-sort-options/donation-sort-options.service';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { ConstantsService } from '~web/shared/services/constants/constants.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
  providers: [DonationSortOptionsService, ListQueryService]
})
export class DonationListComponent {

  readonly filtersForm = new DonationFiltersForm();

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
    public donationSortOptionsService: DonationSortOptionsService,
    public listQueryService: ListQueryService<Donation>,
    private _donationReadService: DonationReadService,
    private _router: Router,
    private _sessionService: SessionService,
  ) {}

  ionViewWillEnter(): void {
    this._myDonations = this._router.url.indexOf('/my') >= 0;
    if (!this.listQueryService.items.length) { // Only do initial load if items have not already loaded.
      this.listQueryService.load(
        this._donationReadService.getDonations.bind(this._donationReadService),
        this.filtersForm
      );
    }
  }

}
