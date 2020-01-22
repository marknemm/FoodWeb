import { AccountType } from '../interfaces/account/account';
import { DateTimeRange } from '../interfaces/date-time/time';
import { Delivery } from '../interfaces/delivery/delivery';
import { Donation, DonationStatus } from '../interfaces/donation/donation';
import { Account } from './account-helper';
import { DonationHelper } from './donation-helper';
import { ValidationHelper } from './validation-helper';

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
    return (donation.claim && donation.claim.delivery)
      ? { startDateTime: donation.claim.delivery.pickupWindowStart, endDateTime: donation.claim.delivery.pickupWindowEnd }
      : { startDateTime: donation.pickupWindowStart, endDateTime: donation.pickupWindowEnd };
  }

  getDropOffWindow(donation: Donation): DateTimeRange {
    if (donation.claim) {
      return (donation.claim.delivery)
        ? { startDateTime: donation.claim.delivery.dropOffWindowStart, endDateTime: donation.claim.delivery.dropOffWindowEnd }
        : { startDateTime: donation.claim.dropOffWindowStart, endDateTime: donation.claim.dropOffWindowEnd };
    }
    return { startDateTime: new Date(), endDateTime: new Date() };
  }

  deliveryDetailsRouterLink(donation: Donation): string[] {
    return ['/delivery/details/', `${donation.id}`];
  }
}
