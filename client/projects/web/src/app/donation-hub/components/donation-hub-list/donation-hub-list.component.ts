import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DonationHubFilterForm, DonationHubFilterFormAdapter } from '~web/donation-hub/services/donation-hub-filter-form-adapter/donation-hub-filter-form-adapter.service';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

/**
 * A list of donation hub drop-off point teasers.
 */
@Component({
  selector: 'foodweb-donation-hub-list',
  templateUrl: './donation-hub-list.component.html',
  styleUrls: ['./donation-hub-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationHubListComponent implements OnInit {

  readonly filtersForm: DonationHubFilterForm = this._donationHubFilterFormAdapter.toForm();

  private _myDonationHubs = false;

  constructor(
    private _donationHubFilterFormAdapter: DonationHubFilterFormAdapter,
    private _donationHubReadService: DonationHubReadService,
    private _listQueryService: ListQueryService<DonationHub>,
    private _router: Router,
    private _shellService: ShellService,
  ) {}

  get donationHubs(): readonly DonationHub[] {
    return this._listQueryService.items;
  }

  get myDonationHubs(): boolean {
    return this._myDonationHubs;
  }

  get noneFound(): boolean {
    return this._listQueryService.noneFound;
  }

  get pageTitle(): string {
    return this._shellService.pageTitle;
  }

  get totalCount(): number {
    return this._listQueryService.totalCount;
  }

  ngOnInit(): void {
    this._myDonationHubs = (this._router.url.indexOf('/my') >= 0);
    this._shellService.pageTitle = (this.myDonationHubs)
      ? 'My Donation Hubs'
      : 'Pledge Donation';
    this._listQueryService.load(
      this._donationHubReadService.getDonationHubs.bind(this._donationHubReadService),
      this.filtersForm,
      this._donationHubFilterFormAdapter
    );
  }

}
