import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountHelper, DeliveryHelper, DonationHelper } from '~shared';
import { DonationAction, DonationActionsService } from '~web/donation-shared/services/donation-actions/donation-actions.service';
import { Donation, DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.scss']
})
export class DonationComponent implements OnInit, OnDestroy {

  protected _destroy$ = new Subject();
  protected _donation: Donation;
  protected _donationNotFound = false;
  protected _myClaim = false;
  protected _myDelivery = false;
  protected _myDonation = false;

  constructor(
    public accountHelper: AccountHelper,
    public donationHelper: DonationHelper,
    public deliveryHelper: DeliveryHelper,
    public shellService: ShellService,
    public sessionService: SessionService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationActionsService: DonationActionsService,
    protected _donationReadService: DonationReadService,
    protected _router: Router,
    protected _urlQueryService: UrlQueryService
  ) {}

  get donation(): Donation {
    return this._donation;
  }

  get donationNotFound(): boolean {
    return this._donationNotFound;
  }

  get loading(): boolean {
    return this._donationReadService.loading;
  }

  get myClaim(): boolean {
    return this._myClaim;
  }

  get myDelivery(): boolean {
    return this._myDelivery;
  }

  get myDonation(): boolean {
    return this._myDonation;
  }

  ngOnInit() {
    this._listenAccountChange();
    this._listenDonationChange();
  }

  private _listenAccountChange(): void {
    this.sessionService.onAccountSave(this._destroy$).subscribe(() =>
      this._updateDonationPrivileges(this._donation)
    );
  }

  private _updateDonationPrivileges(donation: Donation): void {
    if (donation) {
      this._myDonation = this.sessionService.hasAccountOwnership(donation.donorAccount.id);
      this._myClaim = donation.claim
        ? this.sessionService.hasAccountOwnership(donation.claim.receiverAccount.id)
        : false;
      this._myDelivery = (donation.claim && donation.claim.delivery)
        ? this.sessionService.hasAccountOwnership(donation.claim.delivery.volunteerAccount.id)
        : false;
    }
  }

  private _listenDonationChange(): void {
    this._urlQueryService.listenUrlParamChange<number>('id', this._activatedRoute).pipe(
      switchMap((id: number) => this._donationReadService.getDonation(id))
    ).subscribe((donation: Donation) => this._updateDonation(donation));
  }

  private _updateDonation(donation: Donation): void {
    this._donationNotFound = !donation;
    this._donation = donation;
    this._updateDonationPrivileges(donation);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  onDonationAction(action: DonationAction): void {
    this._donationActionsService.onDonationAction(this.donation, action).subscribe((donation: Donation) => {
      (action !== 'Delete')
        ? this._updateDonation(donation)
        : this._router.navigate(['/donation/list/my']);
    });
  }

}
