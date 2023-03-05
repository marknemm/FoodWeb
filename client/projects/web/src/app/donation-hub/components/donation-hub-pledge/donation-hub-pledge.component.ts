import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeDeleteService } from '~web/donation-hub/services/donation-hub-pledge-delete/donation-hub-pledge-delete.service';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-pledge',
  templateUrl: './donation-hub-pledge.component.html',
  styleUrls: ['./donation-hub-pledge.component.scss']
})
export class DonationHubPledgeComponent implements OnInit, OnDestroy {

  readonly postDeleteRoute = ['/', 'donation-hub'];

  protected _destroy$ = new Subject();
  protected _donationHubPledge: DonationHubPledge;
  protected _donationHubPledgeNotFound = false;

  constructor(
    public shellService: ShellService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationHubPledgeDeleteService: DonationHubPledgeDeleteService,
    protected _donationHubPledgeReadService: DonationHubPledgeReadService,
    protected _router: Router,
    protected _sessionService: SessionService,
    protected _urlQueryService: UrlQueryService
  ) {
    this.shellService.pageTitle = 'Donation Pledge';
  }

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
        this._router.navigate(this.postDeleteRoute.concat(`${this.donationHubPledge.donationHub.id}`))
      );
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
