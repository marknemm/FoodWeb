import { Constants } from '../constants/constants';
import { Validation } from '../constants/validation';
import { AccountType } from '../interfaces/account/account';
import { Donation, DonationStatus } from '../interfaces/donation/donation';
import { DonationReadFilters } from '../interfaces/donation/donation-read-filters';
import { Account, AccountHelper } from './account-helper';
import { ValidationHelper } from './validation-helper';
export { Donation };

export class DonationHelper {

  private _constants = new Constants();
  private _validationHelper = new ValidationHelper();
  private _accountHelper = new AccountHelper();

  /**
   * Validates a given donation by inspecting the values of its contained properties.
   * @param donation The donation that is to be validated.
   * @return The error string if the donation is invalid, an empty string if valid.
   */
  validateDonation(donation: Donation): string {
    if (!donation) { return ''; }

    const baseDonationErr: string = this._validateBaseDonation(donation);
    if (baseDonationErr) { return baseDonationErr; }
    
    const pickupWindowErr: string = this._validatePickupWindow(donation.pickupWindowStart, donation.pickupWindowEnd);
    if (pickupWindowErr) { return pickupWindowErr; }

    const donorAccountErr: string = this._accountHelper.validateAccount(donation.donorAccount, true);
    if (donorAccountErr) { return donorAccountErr; }

    const donorContactOverrideErr: string = this._accountHelper.validateContactInfo(donation.donorContactOverride);
    if (donorContactOverrideErr) { return donorContactOverrideErr; }

    return '';
  }

  private _validateBaseDonation(donation: Donation): string {
    const requireErr: string = this._validationHelper.validateRequiredFields(
      donation,
      ['donorAccount', 'donorLastName', 'donorFirstName', 'donationType', 'description', 'donationStatus'],
      [
        'Donor account', 'Donor last name', 'Donor first name', 'Donation type',
        'Donation description', 'Estimated value', 'Donation status'
      ]
    );
    if (requireErr) { return requireErr; }

    if (donation.donationStatus !== 'Unmatched' && !donation.claim) {
      return 'Donation claim required for matched donation';
    }
    if (!Validation.DONATION_STATUS_REGEX.test(donation.donationStatus)) {
      return 'Invalid donation status';
    }
    if (donation.estimatedValue) {
      if (donation.estimatedValue < 0) {
        return 'Estimated value must be positive';
      }
      if (!Validation.MONEY_REGEX.test(donation.estimatedValue.toString())) {
        return 'Estimated value must not contain more than 2 decimal places';
      }
    }

    return '';
  }

  private _validatePickupWindow(pickupWindowStart: Date, pickupWindowEnd: Date): string {
    if (!pickupWindowStart) {
      return 'Pickup window start is required';
    }
    if (!pickupWindowEnd) {
      return 'Pickup window end is required'
    }
    if (pickupWindowStart >= pickupWindowEnd) {
      return 'Pickup window start time must be later than end time';
    }
    return '';
  }

  validateDonationEditPrivilege(donation: Donation, myAccount: Account): string {
    if (!myAccount) {
      return 'You do not own the donation';
    }
    if (myAccount.accountType !== AccountType.Admin) {
      if (donation.donorAccount.id !== myAccount.id) {
        return 'You do not own the donation';
      }
      if (this.isDonationStatusLaterThan(donation, DonationStatus.Scheduled)) {
        return 'Cannot edit/delete a donation that has been picked up';
      }
    }
    return '';
  }

  validateDonationClaimPrivilege(donation: Donation, myAccount: Account): string {
    if (!myAccount || myAccount.accountType !== AccountType.Receiver) {
      return 'Only a Receiver account can claim a donation';
    }
    if (donation.donationStatus !== DonationStatus.Unmatched) {
      return 'Cannot claim a donation that has already been claimed';
    }
    return '';
  }

  validateDonationUnclaimPrivilege(donation: Donation, myAccount: Account): string {
    if (donation.donationStatus === DonationStatus.Unmatched) {
      return 'You cannot unclaimed a donation that has not been claimed';
    }
    if (!myAccount) {
      return 'You do not own the donation claim';
    }
    if (myAccount.accountType !== AccountType.Admin) {
      if (myAccount.id !== donation.claim.receiverAccount.id) {
        return 'You do not own the donation claim';
      }
      if (this.isDonationStatusLaterThan(donation, DonationStatus.Scheduled)) {
        return 'Cannot unclaim a completed donation';
      }
    }
    return '';
  }

  validateDeliveryCancelPrivilege(donation: Donation, myAccount: Account): string {
    if (donation.donationStatus !== DonationStatus.Scheduled) {
      return 'You cannot cancel a delivery that is not in a scheduled state';
    }
    if (
      !myAccount 
      || (
        myAccount.accountType !== AccountType.Admin
        && myAccount.id !== donation.delivery.volunteerAccount.id
        && myAccount.id !== donation.claim.receiverAccount.id
        && myAccount.id !== donation.donorAccount.id
      )
    ) {
      return 'You did not schedule the delivery';
    }
  }

  isDonationStatusLaterThan(toCheck: Donation | DonationStatus, compareStatus: DonationStatus): boolean {
    const toCheckStatus: DonationStatus = (typeof toCheck === 'object') ? toCheck.donationStatus : toCheck;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(toCheckStatus);
    const compareStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(compareStatus);
    return (curStatusIdx > compareStatusIdx);
  }

  isDonationStatusEarlierThan(toCheck: Donation | DonationStatus, compareStatus: DonationStatus): boolean {
    const toCheckStatus: DonationStatus = (typeof toCheck === 'object') ? toCheck.donationStatus : toCheck;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(toCheckStatus);
    const compareStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(compareStatus);
    return (curStatusIdx < compareStatusIdx);
  }

  getNextDonationStatus(nextOf: Donation | DonationStatus): DonationStatus {
    const nextOfStatus: DonationStatus = (typeof nextOf === 'object') ? nextOf.donationStatus : nextOf;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(nextOfStatus);
    return (curStatusIdx !== this._constants.DONATION_STATUSES.length)
      ? this._constants.DONATION_STATUSES[curStatusIdx + 1]
      : null;
  }

  getPrevDonationStatus(prevOf: Donation | DonationStatus): DonationStatus {
    const prevOfStatus: DonationStatus = (typeof prevOf === 'object') ? prevOf.donationStatus : prevOf;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(prevOfStatus);
    return (curStatusIdx > 0)
      ? this._constants.DONATION_STATUSES[curStatusIdx - 1]
      : null;
  }

  findDonationsQueryParams(account: Account): DonationReadFilters {
    if (account) {
      switch (account.accountType) {
        case AccountType.Receiver: return { donationStatus: DonationStatus.Unmatched };
        case AccountType.Volunteer: return { donationStatus: DonationStatus.Matched };
      }
    }
    return {};
  }

  donationDetailsRouterLink(donation: Donation): string[] {
    return ['/donation/details/', `${donation.id}`];
  }

  memberNames(donation: Donation): { donorName: string, receiverName?: string, delivererName?: string } {
    return {
      donorName: this.donorName(donation),
      receiverName: this.receiverName(donation),
      delivererName: this.delivererName(donation)
    };
  }

  donorName(donation: Donation): string {
    return this._accountHelper.accountName(donation.donorAccount);
  }
  
  donorDetailsRouterLink(donation: Donation): string[] {
    return this._accountHelper.accountDetailsRouterLink(donation.donorAccount);
  }

  receiverName(donation: Donation): string {
    return (donation.claim)
      ? this._accountHelper.accountName(donation.claim.receiverAccount)
      : '';
  }

  receiverDetailsRouterLink(donation: Donation): string[] {
    return (donation.claim)
      ? this._accountHelper.accountDetailsRouterLink(donation.claim.receiverAccount)
      : [];
  }

  delivererName(donation: Donation): string {
    return (donation.delivery)
      ? this._accountHelper.accountName(donation.delivery.volunteerAccount)
      : '';
  }

  delivererDetailsRouterLink(donation: Donation): string[] {
    return (donation.delivery)
      ? this._accountHelper.accountDetailsRouterLink(donation.delivery.volunteerAccount)
      : [];
  }
}
