import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Account, AccountType, DonationHub, DonationHubPledge, ListResponse } from '~shared';
import { DonationHubDeleteService } from '~web/donation-hub/services/donation-hub-delete/donation-hub-delete.service';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub',
  templateUrl: './donation-hub.component.html',
  styleUrls: ['./donation-hub.component.scss']
})
export class DonationHubComponent implements OnInit, OnDestroy {

  readonly pledgeSelectRoute = ['/', 'donation-hub', 'pledge'];
  readonly postDeleteRoute = ['/', 'home'];

  protected _destroy$ = new Subject<void>();
  protected _donationHub: DonationHub;
  protected _donationHubNotFound = false;
  protected _pledges: DonationHubPledge[] = [];
  protected _myPledge: DonationHubPledge;

  constructor(
    public donationHubDeleteService: DonationHubDeleteService,
    public shellService: ShellService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationHubPledgeReadService: DonationHubPledgeReadService,
    protected _donationHubReadService: DonationHubReadService,
    protected _router: Router,
    protected _sessionService: SessionService,
    protected _urlQueryService: UrlQueryService
  ) {}

  get canDonate(): boolean {
    return (!this.canViewPledge && this._sessionService.account?.accountType !== AccountType.Receiver);
  }

  get canModify(): boolean {
    return (this.donationHub?.volunteerAccount?.id === this._sessionService.account?.id)
        && (this.donationHub?.dropOffWindowEnd.getTime() >= new Date().getTime());
  }

  get canViewPledge(): boolean {
    return !!this.myPledge;
  }

  get donationHub(): DonationHub {
    return this._donationHub;
  }

  get donationHubNotFound(): boolean {
    return this._donationHubNotFound;
  }

  get loadingActions(): boolean {
    return this._donationHubPledgeReadService.isLoading(this._donationHubPledgeReadService.getMyPledgeUnderDonationHub);
  }

  get loadingPledges(): boolean {
    return this._donationHubPledgeReadService.isLoading(this._donationHubPledgeReadService.getPledgesUnderDonationHub);
  }

  get myAccount(): Account {
    return this._sessionService.account;
  }

  get myPledge(): DonationHubPledge {
    return this._myPledge;
  }

  get pledges(): DonationHubPledge[] {
    return this._pledges;
  }

  ngOnInit(): void {
    this._listenAccountChange();
    this._listenDonationHubChange();
  }

  private _listenAccountChange(): void {
    this._sessionService.onAccountSave(this._destroy$).subscribe(
      () => this._refreshMyPledge()
    );
  }

  private _listenDonationHubChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id)),
    ).subscribe((donationHub: DonationHub) => {
      this._donationHubNotFound = !donationHub;
      this._donationHub = donationHub;
      this._refreshMyPledge();
    });
  }

  private _refreshMyPledge(): void {
    const myPledgeUpdate$: Observable<DonationHubPledge> = (this.donationHub && this._sessionService.loggedIn)
      ? this._donationHubPledgeReadService.getMyPledgeUnderDonationHub(this.donationHub.id, { showLoader: false })
      : of(undefined);
    myPledgeUpdate$.subscribe((myPledge: DonationHubPledge) => this._myPledge = myPledge);
  }

  deleteDonationHub(): void {
    if (this.canModify) {
      this.donationHubDeleteService.deleteDonationHub(this.donationHub).subscribe(() =>
        this._router.navigate(this.postDeleteRoute)
      );
    }
  }

  onDonationPledgesOpened(): void {
    if (!this.pledges?.length) {
      this.refreshDonationHubPledges();
    }
  }

  onDonationHubPledgeSelect(pledge: DonationHubPledge): void {
    this._router.navigate(this.pledgeSelectRoute.concat(`${pledge.id}`));
  }

  refreshDonationHubPledges(): void {
    this._donationHubPledgeReadService.getPledgesUnderDonationHub(this.donationHub.id, {}, { showLoader: false }).subscribe(
      (results: ListResponse<DonationHubPledge>) => this._pledges = results.list
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }
}
