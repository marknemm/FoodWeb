import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DonationHub } from '~shared';
import { DonationHubDeleteService } from '~web/donation-hub/services/donation-hub-delete/donation-hub-delete.service';
import { DonationHubPrivileges, DonationHubPrivilegesService } from '~web/donation-hub/services/donation-hub-privileges/donation-hub-privileges.service';
import { DonationHubReadService } from '~web/donation-hub/services/donation-hub-read/donation-hub-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation-hub-details',
  templateUrl: './donation-hub-details.component.html',
  styleUrls: ['./donation-hub-details.component.scss']
})
export class DonationHubDetailsComponent implements OnInit {

  private _destroy$ = new Subject();
  private _donationHub: DonationHub;
  private _donationHubNotFound = false;
  private _privileges: DonationHubPrivileges = {};

  constructor(
    public donationHubDeleteService: DonationHubDeleteService,
    private _activatedRoute: ActivatedRoute,
    private _donationHubPrivilegesService: DonationHubPrivilegesService,
    private _donationHubReadService: DonationHubReadService,
    private _router: Router,
    private _sessionService: SessionService,
    private _urlQueryService: UrlQueryService
  ) {}

  get donationHub(): DonationHub {
    return this._donationHub;
  }

  get donationHubNotFound(): boolean {
    return this._donationHubNotFound;
  }

  get privileges(): DonationHubPrivileges {
    return this._privileges;
  }

  ngOnInit() {
    this._listenAccountChange();
    this._listenDonationHubChange();
  }

  private _listenAccountChange(): void {
    this._sessionService.onAccountSave(this._destroy$).subscribe(() =>
      this._privileges = this._donationHubPrivilegesService.determinePrivileges(this.donationHub)
    );
  }

  private _listenDonationHubChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationHubReadService.getDonationHub(id))
    ).subscribe((donationHub: DonationHub) => {
      this._donationHubNotFound = !donationHub;
      this._donationHub = donationHub;
      this._privileges = this._donationHubPrivilegesService.determinePrivileges(donationHub);
    });
  }

  deleteDonationHub(): void {
    if (this.privileges.delete) {
      this.donationHubDeleteService.deleteDonationHub(this.donationHub).subscribe(() =>
        this._router.navigate(['/home'])
      );
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
