import { AccountType } from '../interfaces/account/account';
import { DateTimeRange } from '../interfaces/date-time/time';
import { Delivery } from '../interfaces/delivery/delivery';
import { Donation, DonationStatus } from '../interfaces/donation/donation';
import { Account } from './account-helper';
import { DateTimeHelper } from './date-time-helper';
import { ValidationHelper } from './validation-helper';

export class DeliveryHelper {

  private _dateTimeHelepr = new DateTimeHelper();
  private _validationHelper = new ValidationHelper();

  validateDelivery(delivery: Delivery, donationStatus: DonationStatus): string {
    if (!delivery) { return ''; }

    // See what properties are required based off of the donationStatus.
    const validationQueries: (keyof Delivery)[] = ['volunteerAccount', 'pickupWindowStart', 'pickupWindowEnd'];
    if (this.hasDeliveryBeenStarted(donationStatus)) {
      validationQueries.push('startTime');
    }
    if (this.hasDeliveryBeenPickedUp(donationStatus)) {
      validationQueries.push('pickupTime');
    }
    if (this.hasDeliveryBeenCompleted(donationStatus)) {
      validationQueries.push('dropOffTime');
    }

    const requireErr: string = this._validationHelper.validateProps(delivery, validationQueries);
    if (requireErr) { return requireErr; }

    const timeOrderErr: string = this._validateDeliveryTimeOrder(delivery);
    if (timeOrderErr) { return timeOrderErr; }
  }

  private _validateDeliveryTimeOrder(delivery: Delivery): string {
    const volunteerTimezone: string = delivery.volunteerAccount.contactInfo.timezone;
    if (delivery.startTime && delivery.pickupTime) {
      if (delivery.startTime > delivery.pickupTime) {
        return `The delivery start time (${this._dateTimeHelepr.toLocalDateTimeStr(delivery.startTime, volunteerTimezone)})`
          + `cannot be later than the pickup time (${this._dateTimeHelepr.toLocalDateTimeStr(delivery.pickupTime, volunteerTimezone)})`;
      }

      if (delivery.dropOffTime && delivery.pickupTime > delivery.dropOffTime) {
        return `The delivery pickup time (${this._dateTimeHelepr.toLocalDateTimeStr(delivery.pickupTime, volunteerTimezone)})`
          + `cannot be later than the drop-off time (${this._dateTimeHelepr.toLocalDateTimeStr(delivery.dropOffTime, volunteerTimezone)})`;
      }
    }
    return '';
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
    return [
      DonationStatus.Scheduled,
      DonationStatus.Started,
      DonationStatus.PickedUp,
      DonationStatus.Complete
    ].indexOf(donationStatus) >= 0;
  }

  hasDeliveryBeenStarted(donationStatus: DonationStatus): boolean {
    return [
      DonationStatus.Started,
      DonationStatus.PickedUp,
      DonationStatus.Complete
    ].indexOf(donationStatus) >= 0;
  }

  hasDeliveryBeenPickedUp(donationStatus: DonationStatus): boolean {
    return [
      DonationStatus.PickedUp,
      DonationStatus.Complete
    ].indexOf(donationStatus) >= 0;
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

  getPickupWindow(donation: Partial<Donation>): DateTimeRange {
    if (donation) {
      return (donation.claim?.delivery)
        ? { startDateTime: donation.claim.delivery.pickupWindowStart, endDateTime: donation.claim.delivery.pickupWindowEnd }
        : { startDateTime: donation.pickupWindowStart, endDateTime: donation.pickupWindowEnd };
    }
    return null;
  }

  getDropOffWindow(donation: Partial<Donation>): DateTimeRange {
    if (donation?.claim) {
      return (donation.claim.delivery)
        ? { startDateTime: donation.claim.delivery.dropOffWindowStart, endDateTime: donation.claim.delivery.dropOffWindowEnd }
        : { startDateTime: donation.claim.dropOffWindowStart, endDateTime: donation.claim.dropOffWindowEnd };
    }
    return null;
  }

  deliveryDetailsRouterLink(donation: Partial<Donation>): string[] {
    return ['/delivery/details/', `${donation?.id}`];
  }
}
