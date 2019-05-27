import { ValidationHelper } from './validation-helper';
import { AccountHelper, Account } from './account-helper';
import { Delivery } from '../interfaces/donation/delivery';
import { DonationStatus } from '../interfaces/donation/donation';

export class DeliveryHelper {

  private _validationHelper = new ValidationHelper();

  validateDelivery(delivery: Delivery, donationStatus: DonationStatus): string {
    if (!delivery) { return ''; }

    // See what properties are required based off of the donationStatus.
    const requireProps: string[] = ['volunteerAccount'];
    const requireNames: string[] = ['Volunteer account'];
    if (donationStatus === 'Complete') {
      requireProps.push('pickupTime', 'dropOffTime');
      requireNames.push('Pickup time', 'Drop-off time');
    } else if (donationStatus === 'Picked Up') {
      requireProps.push('pickupTime');
      requireNames.push('Pickup time');
    }

    const requireErr: string = this._validationHelper.validateRequiredFields(
      delivery, requireProps, requireNames
    );
    if (requireErr) { return requireErr; }
  }

  validateDeliverySchedulePrivilege(donationStatus: DonationStatus, myAccount: Account): string {
    if (!myAccount || myAccount.accountType !== 'Volunteer') {
      return 'Only a volunteer account can start/schedule a donation delivery';
    }
    if (this.hasDeliveryBeenScheduled(donationStatus)) {
      return 'The donation has already been scheduled for delivery';
    }
    return '';
  }

  validateDeliveryAdvancePrivilege(delivery: Delivery, donationStatus: DonationStatus, myAccount: Account): string {
    if (!delivery || !this.hasDeliveryBeenScheduled(donationStatus)) {
      return 'Cannot advance the status of a delivery that has not been scheduled';
    }
    if (this.hasDeliveryBeenCompleted(donationStatus)) {
      return 'Cannot advance the status of a completed delivery';
    }
    if (!myAccount || myAccount.id !== delivery.volunteerAccount.id) {
      return 'Cannot advance the status of a delivery that you do not own';
    }
    return '';
  }

  validateDeliveryUndoPrivilege(delivery: Delivery, donationStatus: DonationStatus, myAccount: Account): string {
    if (!delivery || !this.hasDeliveryBeenScheduled(donationStatus)) {
      return 'Cannot cancel a delivery that has not been scheduled';
    }
    if (!myAccount || myAccount.id !== delivery.volunteerAccount.id) {
      return 'Cannot revert the status of a delivery that you do not own';
    }
    return '';
  }

  hasDeliveryBeenScheduled(donationStatus: DonationStatus): boolean {
    return (['Scheduled', 'Picked Up', 'Complete'].indexOf(donationStatus) >= 0);
  }

  hasDeliveryBeenPickedUp(donationStatus: DonationStatus): boolean {
    return (['Picked Up', 'Complete'].indexOf(donationStatus) >= 0);
  }

  hasDeliveryBeenCompleted(donationStatus: DonationStatus): boolean {
    return (donationStatus === 'Complete');
  }

  genDeliveryAdvanceTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case 'Scheduled': return 'Set Picked Up';
      case 'Picked Up': return 'Set Complete';
    }
    return '';
  }

  genDeliveryUndoTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case 'Scheduled': return 'Cancel Delivery';
      case 'Picked Up': return 'Undo Delivery Pickup';
      case 'Complete': return 'Undo Delivery Completion';
    }
    return '';
  }

  genConfirmDeliveryUndoMessage(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case 'Scheduled': return 'Are you sure you want to cancel your delivery?';
      case 'Picked Up': return 'Are you sure you want to revert the delivery status to "Scheduled"?';
      case 'Complete': return 'Are you sure you want to revert the delivery status to "Picked Up"?';
    }
    return '';
  }
}
