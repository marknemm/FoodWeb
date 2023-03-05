import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHub } from '~shared';
import { DonationHubFiltersForm } from '~web/donation-hub/forms/donation-hub-filters.form';
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

  readonly filtersForm = new DonationHubFiltersForm();

  private _myDonationHubs = false;

  constructor(
    public listQueryService: ListQueryService<DonationHub>,
    public shellService: ShellService,
    private _donationHubReadService: DonationHubReadService,
    private _router: Router,
  ) {}

  get myDonationHubs(): boolean {
    return this._myDonationHubs;
  }

  ngOnInit(): void {
    this._myDonationHubs = (this._router.url.indexOf('/my') >= 0);
    this.shellService.pageTitle = (this.myDonationHubs)
      ? 'My Donation Hubs'
      : 'Pledge Donation';
    this.listQueryService.load(
      this._donationHubReadService.getDonationHubs.bind(this._donationHubReadService),
      this.filtersForm
    );
  }

}
