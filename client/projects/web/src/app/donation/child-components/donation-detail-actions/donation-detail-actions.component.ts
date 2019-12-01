import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, DeliveryHelper, Donation, DonationHelper } from '~shared';

export type DonationAction = 'ToggleEdit' | 'Save' | 'Delete' | 'Claim' | 'Unclaim' | 'ScheduleDelivery' | 'AdvanceDeliveryState' | 'UndoDeliveryState';

@Component({
  selector: 'food-web-donation-detail-actions',
  templateUrl: './donation-detail-actions.component.html',
  styleUrls: ['./donation-detail-actions.component.scss']
})
export class DonationDetailActionsComponent implements OnChanges {

  @Input() formGroup: FormGroup;
  @Input() donation: Donation;
  @Input() myAccount: Account;
  @Input() editing = false;
  @Input() valid = true;

  @Output() action = new EventEmitter<DonationAction>();

  private _hasActionButtons = false;
  private _canEdit = false;
  private _canClaim = false;
  private _canUnclaim = false;
  private _canScheduleDelivery = false;
  private _canAdvanceDeliveryState = false;
  private _canUndoDeliveryState = false;
  private _deliveryAdvanceTxt = '';
  private _deliveryUndoTxt = '';
  private _confirmDeliveryUndoMessage = '';

  constructor(
    private _donationHelper: DonationHelper,
    private _deliveryHelper: DeliveryHelper
  ) {}

  /**
   * Whether or not action buttons exist according to the current user's donation ownership/privileges.
   */
  get hasActionButtons(): boolean {
    return this._hasActionButtons;
  }

  /**
   * Whether or not the current user can edit the donation.
   */
  get canEdit(): boolean {
    return this._canEdit;
  }

  /**
   * Whether or not the current user can claim the donation.
   */
  get canClaim(): boolean {
    return this._canClaim;
  }

  /**
   * Whether or not the current user can unclaim the donation.
   */
  get canUnclaim(): boolean {
    return this._canUnclaim;
  }

  /**
   * Whether or not the current user can schedule the donation delivery.
   */
  get canScheduleDelivery(): boolean {
    return this._canScheduleDelivery;
  }

  /**
   * Whether or not the current user can advance the delivery state of the donation.
   */
  get canAdvanceDeliveryState(): boolean {
    return this._canAdvanceDeliveryState;
  }

  /**
   * Whether or not the current user can undo the delivery state of the donation.
   */
  get canUndoDeliveryState(): boolean {
    return this._canUndoDeliveryState;
  }

  /**
   * The delivery state advance text (to be used on the advance button).
   */
  get deliveryAdvanceTxt(): string {
    return this._deliveryAdvanceTxt;
  }

  /**
   * The delivery state undo text (to be used on the undo button).
   */
  get deliveryUndoTxt(): string {
    return this._deliveryUndoTxt;
  }

  /**
   * The delivery state undo confirmation message presented to the user when they hit the undo button.
   */
  get confirmDeliveryUndoMessage(): string {
    return this._confirmDeliveryUndoMessage;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation || changes.myAccount) {
      if (this.donation && this.myAccount) {
        this._updateAllAccessFlags();
        this._updateAllText();
      } else {
        this._resetAll();
      }
    }
  }

  /**
   * Updates all of the access/privilege flags based on the set donation and current user.
   */
  private _updateAllAccessFlags(): void {
    this._canEdit = !this._donationHelper.validateDonationEditPrivilege(this.donation, this.myAccount);
    this._canClaim = !this._donationHelper.validateDonationClaimPrivilege(this.donation, this.myAccount);
    this._canUnclaim = !this._donationHelper.validateDonationUnclaimPrivilege(this.donation, this.myAccount);
    this._canScheduleDelivery = !this._deliveryHelper.validateDeliverySchedulePrivilege(this.donation.donationStatus, this.myAccount);
    this._canAdvanceDeliveryState = !this._deliveryHelper.validateDeliveryAdvancePrivilege(
      this.donation.delivery,
      this.donation.donationStatus,
      this.myAccount
    );
    this._canUndoDeliveryState = !this._deliveryHelper.validateDeliveryUndoPrivilege(
      this.donation.delivery,
      this.donation.donationStatus,
      this.myAccount
    );
    this._hasActionButtons = (
      this.canEdit
      || this.canClaim
      || this.canUnclaim
      || this.canScheduleDelivery
      || this.canAdvanceDeliveryState
      || this.canUndoDeliveryState
    );
  }

  /**
   * Updates all donation detail action button text based on the set donation.
   */
  private _updateAllText(): void {
    this._deliveryAdvanceTxt = this._deliveryHelper.genDeliveryAdvanceTxt(this.donation.donationStatus);
    this._deliveryUndoTxt = this._deliveryHelper.genDeliveryUndoTxt(this.donation.donationStatus);
    this._confirmDeliveryUndoMessage = this._deliveryHelper.genConfirmDeliveryUndoMessage(this.donation.donationStatus);
  }

  /**
   * Resets all access/privilege flags and button text to their original/empty states.
   */
  private _resetAll(): void {
    this._canEdit = false;
    this._canClaim = false;
    this._canUnclaim = false;
    this._canScheduleDelivery = false;
    this._canAdvanceDeliveryState = false;
    this._canUndoDeliveryState = false;
    this._hasActionButtons = false;
    this._deliveryAdvanceTxt = '';
    this._deliveryUndoTxt = '';
    this._confirmDeliveryUndoMessage = '';
  }

}
