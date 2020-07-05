import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminDonationClaimService } from '~admin/admin-donation/admin-donation-claim/admin-donation-claim.service';
import { DeliveryHelper, Donation, DonationHelper, DonationStatus } from '~shared';
import { DeliveryScheduleService } from '~web/delivery/delivery-schedule/delivery-schedule.service';
import { DeliveryStatusUpdateService } from '~web/delivery/delivery-status-update/delivery-status-update.service';
import { DonationActionsService } from '~web/donation-delivery-shared/donation-actions/donation-actions.service';
import { DonationDeleteService } from '~web/donation/donation-delete/donation-delete.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDonationActionsService extends DonationActionsService {

  readonly editUrl = '/donation/edit/';

  constructor(
    protected _deliveryHelper: DeliveryHelper,
    protected _deliveryScheduleService: DeliveryScheduleService,
    protected _deliveryStatusUpdateService: DeliveryStatusUpdateService,
    protected _donationClaimService: AdminDonationClaimService,
    protected _donationDeleteService: DonationDeleteService,
    protected _donationHelper: DonationHelper,
    protected _matDialog: MatDialog
  ) {
    super(
      _deliveryHelper,
      _deliveryScheduleService,
      _deliveryStatusUpdateService,
      _donationClaimService,
      _donationDeleteService,
      _donationHelper,
      _matDialog
    );
  }

  /**
   * @override
   */
  protected _updateEditAccess(): void {
    this._setActionAccessFlag('Edit', true); // Admin can always edit the donation even after delivery start.
  }

  /**
   * @override
   */
  protected _updateDeleteAccess(donation: Donation): void {
    super._updateDeleteAccess(donation, this._donationHelper.donorAccout(donation));
  }

  /**
   * @override
   */
  protected _updateClaimAccess(donation: Donation): void {
    this._setActionAccessFlag('Claim', donation.donationStatus === DonationStatus.Unmatched);
  }

  /**
   * @override
   */
  protected _updateUnclaimAccess(donation: Donation): void {
    super._updateUnclaimAccess(donation, this._donationHelper.receiverAccount(donation));
  }

  /**
   * @override
   */
  protected _updateScheduleDeliveryAccess(donation: Donation): void {
    this._setActionAccessFlag('ScheduleDelivery', donation.donationStatus === DonationStatus.Matched);
  }

  /**
   * @override
   */
  protected _updateAdvanceDeliveryStateAccess(donation: Donation): void {
    super._updateAdvanceDeliveryStateAccess(donation, this._donationHelper.volunteerAccount(donation));
  }

  /**
   * @override
   */
  protected _updateUndoDeliveryStateAccess(donation: Donation): void {
    super._updateUndoDeliveryStateAccess(donation, this._donationHelper.volunteerAccount(donation));
  }
}
