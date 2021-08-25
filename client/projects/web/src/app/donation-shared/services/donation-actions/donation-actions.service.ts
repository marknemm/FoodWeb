import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, DeliveryHelper, Donation, DonationHelper } from '~shared';
import { DeliveryScheduleService } from '~web/delivery/services/delivery-schedule/delivery-schedule.service';
import { DeliveryStatusUpdateService } from '~web/delivery/services/delivery-status-update/delivery-status-update.service';
import { DonationClaimService } from '~web/donation/services/donation-claim/donation-claim.service';
import { DonationDeleteService } from '~web/donation/services/donation-delete/donation-delete.service';

export type DonationAction = 'Edit' | 'Save' | 'Delete' | 'Claim' | 'Unclaim' | 'ScheduleDelivery' | 'AdvanceDeliveryState' | 'UndoDeliveryState';

@Injectable({
  providedIn: 'root'
})
export class DonationActionsService {

  protected _actionsAvailable = false;
  protected _donationActionAccessFlags = new Map<DonationAction, true>();

  constructor(
    protected _deliveryHelper: DeliveryHelper,
    protected _deliveryScheduleService: DeliveryScheduleService,
    protected _deliveryStatusUpdateService: DeliveryStatusUpdateService,
    protected _donationClaimService: DonationClaimService,
    protected _donationDeleteService: DonationDeleteService,
    protected _donationHelper: DonationHelper,
    protected _matDialog: MatDialog
  ) {}

  /**
   * Whether or not the user has access to any donation actions.
   */
  get actionsAvailable(): boolean {
    return (this._donationActionAccessFlags.size > 0);
  }

  /**
   * Checks whether or not the user has been granted access to a given donation action.
   * @param action The donation action to check.
   * @return true if access has been granted for the donation action, false if not.
   */
  canAccessAction(action: DonationAction): boolean {
    return this._donationActionAccessFlags.has(action);
  }

  /**
   * Checks whether or not the user has been granted access to any members of a given list of donation actions.
   * @param actions The list of donation actions to check.
   * @return true if access has been granted for any of the given donation actions, false if not.
   */
  canAccessAnyActions(actions: DonationAction[]): boolean {
    return actions.reduce((anyActionsAccess: boolean, action: DonationAction) =>
      (anyActionsAccess || this._donationActionAccessFlags.has(action))
    , false);
  }

  /**
   * Updates all of the access/privilege flags based on the set donation and current user.
   * @param donation The donation to update donation access flags for.
   * @param actingAccount The account that will be acting upon the donation.
   */
  updateAllAccessFlags(donation: Donation, actingAccount: Account): void {
    this._updateEditAccess(donation, actingAccount);
    this._updateDeleteAccess(donation, actingAccount);
    this._updateClaimAccess(donation, actingAccount);
    this._updateUnclaimAccess(donation, actingAccount);
    this._updateScheduleDeliveryAccess(donation, actingAccount);
    this._updateAdvanceDeliveryStateAccess(donation, actingAccount);
    this._updateUndoDeliveryStateAccess(donation, actingAccount);
  }

  protected _updateEditAccess(donation: Donation, actingAccount: Account): void {
    this._setActionAccessFlag('Edit', !this._donationHelper.validateDonationEditPrivilege(donation, actingAccount));
  }

  protected _updateDeleteAccess(donation: Donation, actingAccount: Account): void {
    this._setActionAccessFlag('Delete', !this._donationHelper.validateDonationDeletePrivilege(donation, actingAccount));
  }

  protected _updateClaimAccess(donation: Donation, actingAccount: Account): void {
    this._setActionAccessFlag('Claim', !this._donationHelper.validateDonationClaimPrivilege(donation, actingAccount));
  }

  protected _updateUnclaimAccess(donation: Donation, actingAccount: Account): void {
    this._setActionAccessFlag('Unclaim', !this._donationHelper.validateDonationUnclaimPrivilege(donation, actingAccount));
  }

  protected _updateScheduleDeliveryAccess(donation: Donation, actingAccount: Account): void {
    const scheduleAccess = !this._deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, actingAccount);
    this._setActionAccessFlag('ScheduleDelivery', scheduleAccess);
  }

  protected _updateAdvanceDeliveryStateAccess(donation: Donation, actingAccount: Account): void {
    const advanceDeliveryStateAccess = !this._deliveryHelper.validateDeliveryAdvancePrivilege(
      donation.claim?.delivery,
      donation.donationStatus,
      actingAccount
    );
    this._setActionAccessFlag('AdvanceDeliveryState', advanceDeliveryStateAccess);
  }

  protected _updateUndoDeliveryStateAccess(donation: Donation, actingAccount: Account): void {
    const undoDeliveryStateAccess = !this._deliveryHelper.validateDeliveryUndoPrivilege(
      donation.claim?.delivery,
      donation.donationStatus,
      actingAccount
    );
    this._setActionAccessFlag('UndoDeliveryState', undoDeliveryStateAccess);
  }

  protected _setActionAccessFlag(action: DonationAction, present: boolean): void {
    (present)
      ? this._donationActionAccessFlags.set(action, true)
      : this._donationActionAccessFlags.delete(action);
  }

  /**
   * Resets all donation action access flags.
   */
  resetAllAccessFlags(): void {
    this._donationActionAccessFlags.clear();
  }

  /**
   * Performs a given action on a given donation.
   * @param donation The donation that the action is targeting.
   * @param action The donation action.
   * @return An observable that emits the potentially updated donation after the action is completed.
   */
  onDonationAction(donation: Donation, action: DonationAction): Observable<Donation> {
    switch (action) {
      case 'Delete':                return this._deleteDonation(donation);
      case 'Claim':                 return this._claimDonation(donation);
      case 'Unclaim':               return this._unclaimDonation(donation);
      case 'ScheduleDelivery':      return this._scheduleDelivery(donation);
      case 'AdvanceDeliveryState':  return this._advanceDeliveryState(donation);
      case 'UndoDeliveryState':     return this._undoDeliveryState(donation);
    }
    throw new Error(`Could not handle unknown donation action: ${action}`);
  }

  /**
   * Deletes a given donation.
   * @param donation The donation that is to be deleted.
   * @return An observable that emits the deleted donation after the operation completes.
   */
  protected _deleteDonation(donation: Donation): Observable<Donation> {
    return this._donationDeleteService.deleteDonation(donation).pipe(
      map(() => donation)
    );
  }

  /**
   * Claims a given donation.
   * @param donation The donation that is to be claimed.
   * @return An observable that emits the claimed donation after the operation completes.
   */
  protected _claimDonation(donation: Donation): Observable<Donation> {
    return this._donationClaimService.claimDonation(donation);
  }

  /**
   * Unclaims a given donation.
   * @param donation The donation that is to be unclaimed.
   * @return An observable that emits the unclaimed donation after the operation completes.
   */
  protected _unclaimDonation(donation: Donation): Observable<Donation> {
    return this._donationClaimService.unclaimDonation(donation);
  }

  /**
   * Schedules the delivery of a given donation.
   * @param donation The donation that is to be scheduled for delivery.
   * @return An observable that emits the updated donation after the schedule operaiton completes.
   */
  protected _scheduleDelivery(donation: Donation): Observable<Donation> {
    return this._deliveryScheduleService.scheduleDelivery(donation);
  }

  /**
   * Advances the delivery status of a given donation.
   * @param donation The donation that is to have its delivery status advanced.
   * @return An observable that emits the updated donation after its delivery status is advanced.
   */
  protected _advanceDeliveryState(donation: Donation): Observable<Donation> {
    return this._deliveryStatusUpdateService.advanceDeliveryState(donation);
  }

  /**
   * Undoes the delivery status of a given donation.
   * @param donation The donation that is to have its delivery status undone/reverted.
   * @return An observable that emits the updated donation after its delivery status is reverted.
   */
  protected _undoDeliveryState(donation: Donation): Observable<Donation> {
    return this._deliveryStatusUpdateService.undoDeliveryState(donation);
  }
}
