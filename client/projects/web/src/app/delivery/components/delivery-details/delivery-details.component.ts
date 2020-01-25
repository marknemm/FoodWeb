import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Donation } from '~shared';
import { DonationAction, DonationActionsService } from '~web/donation-delivery-shared/donation-actions/donation-actions.service';
import { DonationService } from '~web/donation/donation/donation.service';
import { SessionService } from '~web/session/session/session.service';
import { PageTitleService } from '~web/shared/page-title/page-title.service';

@Component({
  selector: 'food-web-delivery-details',
  templateUrl: './delivery-details.component.html',
  styleUrls: ['./delivery-details.component.scss'],
})
export class DeliveryDetailsComponent implements OnInit {

  private _deliveryNotFound = false;
  private _destroy$ = new Subject();
  private _donation: Donation;
  private _myDelivery = false;

  constructor(
    public pageTitleService: PageTitleService,
    public sessionService: SessionService,
    private _activatedRoute: ActivatedRoute,
    private _donationActionsService: DonationActionsService,
    private _donationService: DonationService
  ) {}

  get deliveryNotFound(): boolean {
    return this._deliveryNotFound;
  }

  get donation(): Donation {
    return this._donation;
  }

  get myDelivery(): boolean {
    return this._myDelivery;
  }

  ngOnInit() {
    this._listenAccountChange();
    this._listenDonationChange();
  }

  private _listenAccountChange(): void {
    this.sessionService.onLogin(this._destroy$).subscribe(() =>
      this._updateDeliveryPrivileges(this._donation)
    );
  }

  private _updateDeliveryPrivileges(donation: Donation): void {
    if (donation) { 
      this._myDelivery = (donation.claim && donation.claim.delivery)
        ? this.sessionService.isMyAccount(donation.claim.delivery.volunteerAccount.id)
        : false;
    }
  }

  private _listenDonationChange(): void {
    this._donationService.listenDonationQueryChange(this._activatedRoute).subscribe((donation: Donation) =>
      setTimeout(() => this._updateDonation(donation))
    );
  }

  private _updateDonation(donation: Donation): void {
    this._deliveryNotFound = !donation;
    this._donation = donation;
    this._updateDeliveryPrivileges(donation);
  }

  onDeliveryAction(action: DonationAction): void {
    this._donationActionsService.onDonationAction(this.donation, action).subscribe((donation: Donation) =>
      this._updateDonation(donation)
    );
  }

}
