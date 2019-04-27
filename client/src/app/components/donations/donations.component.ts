import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DonationService, Donation } from '../../services/donation/donation.service';
import { PageTitleService } from '../../services/page-title/page-title.service';
import { ListResponse } from '../../../../../shared/src/interfaces/list-response';
import { AccountHelper } from '../../../../../shared/src/helpers/account-helper';

@Component({
  selector: 'food-web-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.scss']
})
export class DonationsComponent implements OnInit {

  donations: Donation[] = [];
  totalCount = 0;

  private _destroy$ = new Subject();

  constructor(
    public pageTitleService: PageTitleService,
    public accountHelper: AccountHelper,
    private _donationService: DonationService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._donationService.listenDonationsQueryChange(this._activatedRoute).pipe(
      takeUntil(this._destroy$)
    ).subscribe(
      (response: ListResponse<Donation>) => {
        this.donations = response.list;
        this.totalCount = response.totalCount;
      }
    );
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

}
