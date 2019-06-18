import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Donation, DonationHelper } from '../../../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../../../shared/src/helpers/delivery-helper';
import { Account } from '../../../../../shared/src/interfaces/account/account';

export type DonationAction = 'ToggleEdit' | 'Save' | 'Delete' | 'Claim' | 'Unclaim' | 'ScheduleDelivery' | 'AdvanceDeliveryState' | 'UndoDeliveryState';

@Component({
  selector: 'food-web-donation-detail-actions',
  templateUrl: './donation-detail-actions.component.html',
  styleUrls: ['./donation-detail-actions.component.scss']
})
export class DonationDetailActionsComponent implements OnInit, OnChanges {

  @Input() donation: Donation;
  @Input() myAccount: Account;
  @Input() editing = false;

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

  get hasActionButtons(): boolean {
    return this._hasActionButtons;
  }

  get canEdit(): boolean {
    return this._canEdit;
  }

  get canClaim(): boolean {
    return this._canClaim;
  }

  get canUnclaim(): boolean {
    return this._canUnclaim;
  }

  get canScheduleDelivery(): boolean {
    return this._canScheduleDelivery;
  }

  get canAdvanceDeliveryState(): boolean {
    return this._canAdvanceDeliveryState;
  }

  get canUndoDeliveryState(): boolean {
    return this._canUndoDeliveryState;
  }

  get deliveryAdvanceTxt(): string {
    return this._deliveryAdvanceTxt;
  }

  get deliveryUndoTxt(): string {
    return this._deliveryUndoTxt;
  }

  get confirmDeliveryUndoMessage(): string {
    return this._confirmDeliveryUndoMessage;
  }

  ngOnInit() {}

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

  private _updateAllText(): void {
    this._deliveryAdvanceTxt = this._deliveryHelper.genDeliveryAdvanceTxt(this.donation.donationStatus);
    this._deliveryUndoTxt = this._deliveryHelper.genDeliveryUndoTxt(this.donation.donationStatus);
    this._confirmDeliveryUndoMessage = this._deliveryHelper.genConfirmDeliveryUndoMessage(this.donation.donationStatus);
  }

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
