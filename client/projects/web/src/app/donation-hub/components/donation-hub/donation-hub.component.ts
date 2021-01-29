import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Account, AccountType, DonationHub, DonationHubPledge, ListResponse } from '~shared';
import { DonationHubDeleteService } from '~web/donation-hub/services/donation-hub-delete/donation-hub-delete.service';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub',
  templateUrl: './donation-hub.component.html',
  styleUrls: ['./donation-hub.component.scss']
})
export class DonationHubComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _donationHub: DonationHub;
  private _donationHubNotFound = false;
  private _pledges: DonationHubPledge[] = [];

  constructor(
    public donationHubDeleteService: DonationHubDeleteService,
    private _activatedRoute: ActivatedRoute,
    private _donationHubPledgeReadService: DonationHubPledgeReadService,
    private _donationHubReadService: DonationHubReadService,
    private _router: Router,
    private _sessionService: SessionService,
    private _urlQueryService: UrlQueryService
  ) {}

  get canModify(): boolean {
    return (this.donationHub?.volunteerAccount?.id === this._sessionService.account?.id);
  }

  get canDonate(): boolean {
    return (!this.canModify && this._sessionService.account?.accountType !== AccountType.Receiver);
  }

  get donationHub(): DonationHub {
    return this._donationHub;
  }

  get donationHubNotFound(): boolean {
    return this._donationHubNotFound;
  }

  get loadingPledges(): boolean {
    return this._donationHubPledgeReadService.loading;
  }

  get myAccount(): Account {
    return this._sessionService.account;
  }

  get pledges(): DonationHubPledge[] {
    return this._pledges;
  }

  ngOnInit() {
    this._listenDonationHubChange();
  }

  private _listenDonationHubChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id))
    ).subscribe((donationHub: DonationHub) => {
      this._donationHubNotFound = !donationHub;
      this._donationHub = donationHub;
    });
  }

  deleteDonationHub(): void {
    if (this.canModify) {
      this.donationHubDeleteService.deleteDonationHub(this.donationHub).subscribe(() =>
        this._router.navigate(['/home'])
      );
    }
  }

  onDonationPledgesOpened(): void {
    if (!this.pledges?.length) {
      this.refreshDonationHubPledges();
    }
  }

  onDonationHubPledgeSelect(pledge: DonationHubPledge): void {
    this._router.navigate(['/donation-hub', 'pledge', pledge.id]);
  }

  refreshDonationHubPledges(): void {
    this._donationHubPledgeReadService.getPledgesUnderDonationHub(this.donationHub.id, {}, { showPageProgressOnLoad: false }).subscribe(
      (results: ListResponse<DonationHubPledge>) => this._pledges = results.list
    );
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
