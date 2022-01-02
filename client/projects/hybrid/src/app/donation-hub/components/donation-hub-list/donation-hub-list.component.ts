import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DonationHubFiltersForm } from '~web/donation-hub/forms/donation-hub-filters.form';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationHubListComponent {

  readonly filtersForm = new DonationHubFiltersForm();

  private _myDonationHubs = false;

  constructor(
    public listQueryService: ListQueryService<DonationHub>,
    private _donationHubReadService: DonationHubReadService,
    private _router: Router
  ) {}

  get myDonationHubs(): boolean {
    return this._myDonationHubs;
  }

  get pageTitle(): string {
    return (this.myDonationHubs ? 'My Donation Hubs' : 'Donation Hubs');
  }

  ionViewWillEnter(): void {
    this._myDonationHubs = (this._router.url.indexOf('/my') >= 0);
    if (!this.listQueryService.items.length) {
      this.listQueryService.load(
        this._donationHubReadService.getDonationHubs.bind(this._donationHubReadService),
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
}
