import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DonationHubPledge } from '~shared';
import { DonationHubPledgeReadService } from '~web/donation-hub/services/donation-hub-pledge-read/donation-hub-pledge-read.service';
import { SessionService } from '~web/session/services/session/session.service';
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
    private _activatedRoute: ActivatedRoute,
    private _donationHubPledgeReadService: DonationHubPledgeReadService,
    private _router: Router,
    private _sessionService: SessionService,
    private _urlQueryService: UrlQueryService
  ) {}

  get donationHubPledge(): DonationHubPledge {
    return this._donationHubPledge;
  }

  get donationHubPledgeNotFound(): boolean {
    return this._donationHubPledgeNotFound;
  }

  // get privileges(): DonationHubPrivileges {
  //   return this._privileges;
  // }

  ngOnInit() {
    this._listenAccountChange();
    this._listenDonationHubPledgeChange();
  }

  private _listenAccountChange(): void {
    // this._sessionService.onAccountSave(this._destroy$).subscribe(() =>
    //   this._privileges = this._donationHubPrivilegesService.determinePrivileges(this.donationHub)
    // );
  }

  private _listenDonationHubPledgeChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubPledgeReadService.getDonationHubPledge(id))
    ).subscribe((donationHubPledge: DonationHubPledge) => {
      this._donationHubPledgeNotFound = !donationHubPledge;
      this._donationHubPledge = donationHubPledge;
      // this._privileges = this._donationHubPledgePrivilegesService.determinePrivileges(donationHubPledge);
    });
  }

  deleteDonationHubPledge(): void {
    // if (this.privileges.delete) {
    //   this.donationHubPledgeDeleteService.deleteDonationHubPledge(this.donationHubPledge).subscribe(() =>
    //     this._router.navigate(['/home'])
    //   );
    // }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
