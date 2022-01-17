import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeFiltersForm } from '~web/donation-hub/forms/donation-hub-pledge-filters.form';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { ListQueryService } from '~web/shared/services/list-query/list-query.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-hub-pledge-list',
  templateUrl: './donation-hub-pledge-list.component.html',
  styleUrls: ['./donation-hub-pledge-list.component.scss'],
  providers: [ListQueryService]
})
export class DonationHubPledgeListComponent implements OnInit {

  readonly filtersForm = new DonationHubPledgeFiltersForm();

  private _myPledges = false;

  constructor(
    public listQueryService: ListQueryService<DonationHubPledge>,
    public pageTitleService: PageTitleService,
    private _pledgeReadService: DonationHubPledgeReadService,
    private _router: Router,
  ) {}

  get myPledges(): boolean {
    return this._myPledges;
  }

  ngOnInit(): void {
    this._myPledges = this._router.url.indexOf('/my') >= 0;
    this.pageTitleService.title = (this._myPledges)
      ? 'My Donation Pledges'
      : 'Donation Pledges';
    this.listQueryService.load(
      this._pledgeReadService.getDonationHubPledges.bind(this._pledgeReadService),
      this.filtersForm
    );
  }
}
