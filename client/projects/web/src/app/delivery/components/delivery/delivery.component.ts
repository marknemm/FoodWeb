import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Donation } from '~shared';
import { DonationAction, DonationActionsService } from '~web/donation-shared/services/donation-actions/donation-actions.service';
import { DonationReadService } from '~web/donation/services/donation-read/donation-read.service';
import { SessionService } from '~web/session/services/session/session.service';
import { ShellService } from '~web/shell/services/shell/shell.service';
import { UrlQueryService } from '~web/shared/services/url-query/url-query.service';

@Component({
  selector: 'foodweb-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {

  protected _deliveryNotFound = false;
  protected _destroy$ = new Subject<void>();
  protected _donation: Donation;
  protected _myDelivery = false;

  constructor(
    public shellService: ShellService,
    public sessionService: SessionService,
    protected _activatedRoute: ActivatedRoute,
    protected _donationActionsService: DonationActionsService,
    protected _donationReadService: DonationReadService,
    protected _urlQueryService: UrlQueryService
  ) { }

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
    this.sessionService.onAccountSave(this._destroy$).subscribe(() =>
      this._updateDeliveryPrivileges(this._donation)
    );
  }

  private _updateDeliveryPrivileges(donation: Donation): void {
    if (donation) {
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
