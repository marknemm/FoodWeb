import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeFilterForm, DonationHubPledgeFilterFormAdapter } from '~web/donation-hub/services/donation-hub-pledge-filter-form-adapter/donation-hub-pledge-filter-form-adapter.service';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { ShellService } from '~web/shell/services/shell/shell.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationHubPledgeListComponent implements OnInit {

  readonly filtersForm: DonationHubPledgeFilterForm = this._donationHubPledgeFilterFormAdapter.toForm();

  private _myPledges = false;

  constructor(
    private _donationHubPledgeFilterFormAdapter: DonationHubPledgeFilterFormAdapter,
    private _listQueryService: ListQueryService<DonationHubPledge>,
    private _pledgeReadService: DonationHubPledgeReadService,
    private _router: Router,
    private _shellService: ShellService,
  ) {}

  get pledges(): readonly DonationHubPledge[] {
    return this._listQueryService.items;
  }

  get myPledges(): boolean {
    return this._myPledges;
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
    this._myPledges = this._router.url.indexOf('/my') >= 0;
    this._shellService.pageTitle = (this._myPledges)
      ? 'My Donation Pledges'
      : 'Donation Pledges';
    this._listQueryService.load(
      this._pledgeReadService.getDonationHubPledges.bind(this._pledgeReadService),
      this.filtersForm,
      this._donationHubPledgeFilterFormAdapter
    );
  }
}
