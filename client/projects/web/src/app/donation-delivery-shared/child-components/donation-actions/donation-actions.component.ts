import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Account, DeliveryHelper, Donation, DonationStatus } from '~shared';
import { DonationAction, DonationActionsService } from '~web/donation-delivery-shared/services/donation-actions/donation-actions.service';

@Component({
  selector: 'foodweb-donation-actions',
  templateUrl: './donation-actions.component.html',
  styleUrls: ['./donation-actions.component.scss']
})
export class DonationActionsComponent implements OnChanges {

  @Input() donation: Donation;
  @Input() donationUpdateForm: FormGroup;
  @Input() hideActionHints = false;
  @Input() myAccount: Account;
  @Input() valid = true;
  @Input() allowAllEditActions = false;

  @Output() action = new EventEmitter<DonationAction>();

  private _canAccessDeliveryStatusActions = false;
  private _confirmDeliveryUndoMessage = '';
  private _deliveryActionRequiredTxt = '';
  private _deliveryAdvanceTxt = '';
  private _deliveryRevertTxt = '';

  constructor(
    public donationActionsService: DonationActionsService,
    private _deliveryHelper: DeliveryHelper
  ) {}

  /**
   * Wether or not any of the delivery status (advance/undo) actions can be accessed.
   */
  get canAccessDeliveryStatusActions(): boolean {
    return this._canAccessDeliveryStatusActions;
  }

  /**
   * The delivery state undo confirmation message presented to the user when they hit the undo button.
   */
  get confirmDeliveryUndoMessage(): string {
    return this._confirmDeliveryUndoMessage;
  }

  /**
   * The delivery state action required text (to prompt the user to advance the delivery status).
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.donation || changes.myAccount) {
      if (this.donation && this.myAccount) {
        this.donationActionsService.updateAllAccessFlags(this.donation, this.myAccount);
        this._canAccessDeliveryStatusActions = this.donationActionsService.canAccessAnyActions(
          ['UndoDeliveryState', 'AdvanceDeliveryState']
        );
        this._updateAllText();
      } else {
        this._resetAll();
      }
    }
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
    if (this.donationActionsService.canAccessAction('AdvanceDeliveryState')) {
      switch (donationStatus) {
        case DonationStatus.Scheduled:  return `Select 'Start Delivery' when you depart to pickup the donation.`;
        case DonationStatus.Started:    return `Select 'Advance Status' once you have picked up the donation.`;
        case DonationStatus.PickedUp:   return `Select 'Advance Status' once you have dropped off the donation.`;
      }
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
    this.donationActionsService.resetAllAccessFlags();
    this._deliveryAdvanceTxt = '';
    this._deliveryRevertTxt = '';
    this._confirmDeliveryUndoMessage = '';
  }

}
