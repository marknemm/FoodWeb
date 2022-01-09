import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeFiltersForm } from '~web/donation-hub/forms/donation-hub-pledge-filters.form';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';

@Component({
  selector: 'foodweb-hybrid-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationHubPledgeListComponent {

  readonly filtersForm = new DonationHubPledgeFiltersForm();

  private _myPledges = false;

  constructor(
    public listQueryService: ListQueryService<DonationHubPledge>,
    private _pledgeReadService: DonationHubPledgeReadService,
    private _router: Router
  ) {}

  get myPledges(): boolean {
    return this._myPledges;
  }

  get pageTitle(): string {
    return (this._myPledges ? 'My Donations' : 'Donation Pledges');
  }

  ionViewWillEnter(): void {
    this._myPledges = this._router.url.indexOf('/my') >= 0;
    if (!this.listQueryService.items.length) {
      this.listQueryService.load(
        this._pledgeReadService.getDonationHubPledges.bind(this._pledgeReadService),
        this.filtersForm
      );
    }
  }

  /**
   * Handles an ionInfinite event by loading the next segment of Donation/Delivery List items.
   * @param event The ionInfinite event.
   */
  handleLoadMore(event: any): void {
    this.listQueryService.loadMore().subscribe(() => event.target.complete());
  }

  /**
   * Handles an ionRefresh event by refreshing the Donation/Delivery List items.
   * @param event The ionRefresh event.
   */
  handleRefresh(event: any): void {
    this.listQueryService.refresh({ showLoader: false }).subscribe(() => event.target.complete());
  }
}
