import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, AccountHelper, DeliveryHelper, Donation, DonationHelper, DonationStatus } from '~shared';
import { DonationAction } from '~web/donation-delivery-shared/donation-actions/donation-actions.service';

@Component({
  selector: 'food-web-donation-actions',
  templateUrl: './donation-actions.component.html',
  styleUrls: ['./donation-actions.component.scss']
})
export class DonationActionsComponent implements OnChanges {

  @Input() donation: Donation;
  @Input() donationUpdateForm: FormGroup;
  @Input() hideActionHint = false;
  @Input() myAccount: Account;
  @Input() valid = true;

  @Output() action = new EventEmitter<DonationAction>();

  private _hasActionButtons = false;
  private _canEdit = false;
  private _canClaim = false;
  private _canUnclaim = false;
  private _canScheduleDelivery = false;
  private _canAdvanceDeliveryState = false;
  private _canUndoDeliveryState = false;
  private _deliveryActionRequiredTxt = '';
  private _deliveryAdvanceTxt = '';
  private _deliveryRevertTxt = '';
  private _confirmDeliveryUndoMessage = '';

  constructor(
    private _accountHelper: AccountHelper,
    private _deliveryHelper: DeliveryHelper,
    private _donationHelper: DonationHelper
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
   * The deliveery state action required text (to prompt the user to advance the delivery status).
   */
  get deliveryActionRequiredTxt(): string {
    return this._deliveryActionRequiredTxt;
  }

  /**
   * The delivery state advance text (to be used on the advance status button).
   */
  get deliveryAdvanceTxt(): string {
    return this._deliveryAdvanceTxt;
  }

  /**
   * The delivery state revert text (to be used on the revert status button).
   */
  get deliveryRevertTxt(): string {
    return this._deliveryRevertTxt;
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
    this._canUnclaim = !this._donationHelper.validateDonationUnclaimPrivilege(this.donation, this.myAccount)
                    && this._accountHelper.isReceiver(this.myAccount);
    this._canScheduleDelivery = this._accountHelper.isVolunteer(this.myAccount) && this.donation.claim && !this.donation.claim.delivery;
    this._canAdvanceDeliveryState = this.donation.claim && !this._deliveryHelper.validateDeliveryAdvancePrivilege(
      this.donation.claim.delivery,
      this.donation.donationStatus,
      this.myAccount
    );
    this._canUndoDeliveryState = this.donation.claim && !this._deliveryHelper.validateDeliveryUndoPrivilege(
      this.donation.claim.delivery,
      this.donation.donationStatus,
      this.myAccount
    ) && this._accountHelper.isVolunteer(this.myAccount);
    this._hasActionButtons = this._canEdit || this._canClaim || this._canUnclaim || this._canScheduleDelivery
                          || this._canAdvanceDeliveryState || this._canUndoDeliveryState;
  }

  /**
   * Updates all donation detail action button text based on the set donation.
   */
  private _updateAllText(): void {
    this._deliveryActionRequiredTxt = this._genDeliveryActionRequiredTxt(this.donation.donationStatus);
    this._deliveryAdvanceTxt = this._genDeliveryAdvanceTxt(this.donation.donationStatus);
    this._deliveryRevertTxt = this._genDeliveryRevertTxt(this.donation.donationStatus);
    this._confirmDeliveryUndoMessage = this._deliveryHelper.genConfirmDeliveryUndoMessage(this.donation.donationStatus);
  }

  /**
   * Generates delivery 'action required' text that is used to prompt the user to advance the delivery status.
   * @param donationStatus The current status of the donation/delivery.
   * @return The delivery 'action required' text. An empty string if the current donation/delivery status does not require it.
   */
  private _genDeliveryActionRequiredTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled:  return `Select 'Start Delivery' when you depart to pickup the donation.`;
      case DonationStatus.Started:    return `Select 'Advance Status' once you have picked up the donation.`;
      case DonationStatus.PickedUp:   return `Select 'Advance Status' once you have dropped off the donation.`;
    }
    return '';
  }

  /**
   * Generates the delivery 'advance' status button text.
   * @param donationStatus The current status of the donation/delivery.
   * @return The delivery 'advance' status button text. An empty string if the current donation/delivery status does not require it.
   */
  private _genDeliveryAdvanceTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled:  return 'Start Delivery';
      case DonationStatus.Started:
      case DonationStatus.PickedUp:   return `Advance Status`;
    }
    return '';
  }

  /**
   * Generates the delivery 'advance' status button text.
   * @param donationStatus The current status of the donation/delivery.
   * @return The delivery 'advance' status button text. An empty string if the current donation/delivery status does not require it.
   */
  private _genDeliveryRevertTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled:  return 'Cancel Delivery';
      case DonationStatus.Started:
      case DonationStatus.PickedUp:
      case DonationStatus.Complete:   return 'Revert Status';
    }
    return '';
  }

  /**
   * Resets all access/privilege flags and button text to their original/empty states.
   */
  private _resetAll(): void {
    this._hasActionButtons = false;
    this._canEdit = false;
    this._canClaim = false;
    this._canUnclaim = false;
    this._canScheduleDelivery = false;
    this._canAdvanceDeliveryState = false;
    this._canUndoDeliveryState = false;
    this._deliveryAdvanceTxt = '';
    this._deliveryRevertTxt = '';
    this._confirmDeliveryUndoMessage = '';
  }

}
