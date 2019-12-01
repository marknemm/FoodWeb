import { ValidationHelper } from './validation-helper';
import { Account } from './account-helper';
import { DonationHelper } from './donation-helper';
import { Delivery } from '../interfaces/delivery/delivery';
import { DonationStatus, Donation } from '../interfaces/donation/donation';
import { DateTimeRange } from '../interfaces/misc/time';
import { AccountType } from '../interfaces/account/account';

export class DeliveryHelper {

  private _donationHelper = new DonationHelper();
  private _validationHelper = new ValidationHelper();

  validateDelivery(delivery: Delivery, donationStatus: DonationStatus): string {
    if (!delivery) { return ''; }

    // See what properties are required based off of the donationStatus.
    const requireProps: string[] = ['volunteerAccount'];
    const requireNames: string[] = ['Volunteer account'];
    if (donationStatus === DonationStatus.Complete) {
      requireProps.push('pickupTime', 'dropOffTime');
      requireNames.push('Pickup time', 'Drop-off time');
    } else if (donationStatus === DonationStatus.PickedUp) {
      requireProps.push('pickupTime');
      requireNames.push('Pickup time');
    }

    const requireErr: string = this._validationHelper.validateRequiredFields(
      delivery, requireProps, requireNames
    );
    if (requireErr) { return requireErr; }
  }

  validateDeliverySchedulePrivilege(donationStatus: DonationStatus, myAccount: Account): string {
    if (!myAccount || myAccount.accountType !== AccountType.Volunteer) {
      return 'Only a volunteer account can start/schedule a donation delivery';
    }
    if (this.hasDeliveryBeenScheduled(donationStatus)) {
      return 'The donation has already been scheduled for delivery';
    }
    if (donationStatus !== DonationStatus.Matched) {
      return 'Cannot schedule the delivery of a donation that has not been matched with a receiver';
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
    return this._donationHelper.isDonationStatusLaterThan(donationStatus, DonationStatus.Matched);
  }

  hasDeliveryBeenPickedUp(donationStatus: DonationStatus): boolean {
    return ([DonationStatus.PickedUp, DonationStatus.Complete].indexOf(donationStatus) >= 0);
  }

  hasDeliveryBeenCompleted(donationStatus: DonationStatus): boolean {
    return (donationStatus === DonationStatus.Complete);
  }

  genDeliveryAdvanceTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled:  return 'Start Delivery';
      case DonationStatus.Started:    return 'Set Picked Up'
      case DonationStatus.PickedUp:   return 'Set Complete';
    }
    return '';
  }

  genDeliveryUndoTxt(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled:  return 'Cancel Delivery';
      case DonationStatus.Started:    return 'Undo Delivery Start';
      case DonationStatus.PickedUp:   return 'Undo Delivery Pickup';
      case DonationStatus.Complete:   return 'Undo Delivery Completion';
    }
    return '';
  }

  genConfirmDeliveryUndoMessage(donationStatus: DonationStatus): string {
    switch (donationStatus) {
      case DonationStatus.Scheduled: return 'Are you sure you want to cancel your delivery?';
      case DonationStatus.Started: return 'Are you sure you want to revert the delivery status to "Scheduled"?';
      case DonationStatus.PickedUp: return 'Are you sure you want to revert the delivery status to "Started"?';
      case DonationStatus.Complete: return 'Are you sure you want to revert the delivery status to "Picked Up"?';
    }
    return '';
  }

  getPickupWindow(donation: Donation): DateTimeRange {
    return (donation.delivery)
      ? { startDateTime: donation.delivery.pickupWindowStart, endDateTime: donation.delivery.pickupWindowEnd }
      : { startDateTime: donation.pickupWindowStart, endDateTime: donation.pickupWindowEnd };
  }
}
