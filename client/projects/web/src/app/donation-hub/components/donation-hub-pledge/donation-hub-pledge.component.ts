import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeDeleteService } from '~web/donation-hub/services/donation-hub-pledge-delete/donation-hub-pledge-delete.service';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { PageTitleService } from '~web/shared/services/page-title/page-title.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge',
  templateUrl: './donation-hub-pledge.component.html',
  styleUrls: ['./donation-hub-pledge.component.scss']
})
export class DonationHubPledgeComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _donationHubPledge: DonationHubPledge;
  private _donationHubPledgeNotFound = false;

  constructor(
    public pagetTitleService: PageTitleService,
    private _activatedRoute: ActivatedRoute,
    private _donationHubPledgeDeleteService: DonationHubPledgeDeleteService,
    private _donationHubPledgeReadService: DonationHubPledgeReadService,
    private _router: Router,
    private _sessionService: SessionService,
    private _urlQueryService: UrlQueryService
  ) {}

  get canModify(): boolean {
    return (this.donationHubPledge?.account?.id === this._sessionService.account?.id);
  }

  get donationHubPledge(): DonationHubPledge {
    return this._donationHubPledge;
  }

  get donationHubPledgeNotFound(): boolean {
    return this._donationHubPledgeNotFound;
  }

  ngOnInit() {
    this.pagetTitleService.title = 'Donation Pledge';
    this._listenDonationHubPledgeChange();
  }

  private _listenDonationHubPledgeChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubPledgeReadService.getDonationHubPledge(id))
    ).subscribe((donationHubPledge: DonationHubPledge) => {
      this._donationHubPledgeNotFound = !donationHubPledge;
      this._donationHubPledge = donationHubPledge;
    });
  }

  deleteDonationHubPledge(): void {
    if (this.canModify) {
      this._donationHubPledgeDeleteService.deleteDonationPledge(this.donationHubPledge).subscribe(() =>
        this._router.navigate(['/donation-hub', this.donationHubPledge.donationHub.id])
      );
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
