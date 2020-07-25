import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountHelper, DeliveryHelper, DonationHelper } from '~shared';
import { DonationAction, DonationActionsService } from '~web/donation-delivery-shared/donation-actions/donation-actions.service';
import { Donation, DonationReadService } from '~web/donation/donation-read/donation-read.service';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'foodweb-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss']
})
export class DonationDetailsComponent implements OnInit, OnDestroy {

  private _destroy$ = new Subject();
  private _donation: Donation;
  private _donationNotFound = false;
  private _myClaim = false;
  private _myDelivery = false;
  private _myDonation = false;

  constructor(
    public accountHelper: AccountHelper,
    public donationHelper: DonationHelper,
    public deliveryHelper: DeliveryHelper,
    public pageTitleService: PageTitleService,
    public sessionService: SessionService,
    private _activatedRoute: ActivatedRoute,
    private _donationActionsService: DonationActionsService,
    private _donationReadService: DonationReadService,
    private _router: Router
  ) {}

  get donation(): Donation {
    return this._donation;
  }

  get donationNotFound(): boolean {
    return this._donationNotFound;
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
    this.sessionService.onLogin(this._destroy$).subscribe(() =>
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
    this._donationReadService.listenDonationQueryChange(this._activatedRoute).subscribe(
      (donation: Donation) => setTimeout(() => this._updateDonation(donation))
    );
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
