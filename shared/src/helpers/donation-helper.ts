import { ValidationHelper } from './validation-helper';
import { AccountHelper, Account } from './account-helper';
import { Constants } from '../constants/constants';
import { Validation } from '../constants/validation';
import { Donation, DonationStatus } from '../interfaces/donation/donation';
import { DonationReadFilters } from '../interfaces/donation/donation-read-filters';
import { AccountType } from '../interfaces/account/account';
export { Donation };

export class DonationHelper {

  private _constants = new Constants();
  private _validationHelper = new ValidationHelper();
  private _accountHelper = new AccountHelper();

  validateDonation(donation: Donation): string {
    if (!donation) { return ''; }

    const requireErr: string = this._validationHelper.validateRequiredFields(
      donation,
      ['donorAccount', 'donorLastName', 'donorFirstName', 'donationType', 'description', 'estimatedValue', 'donationStatus'],
      ['Donor account', 'Donor last name', 'Donor first name', 'Donation type', 'Donation description', 'Estimated value', 'Donation status']
    );
    if (requireErr) { return requireErr; }

    if (donation.donationStatus !== 'Unmatched' && !donation.receiverAccount) {
      return 'Receiver account required for matched donation';
    }
    if (!Validation.DONATION_STATUS_REGEX.test(donation.donationStatus)) {
      return 'Invalid donation status';
    }
    if (donation.estimatedValue < 0) {
      return 'Estimated value must be positive';
    }
    if (!Validation.MONEY_REGEX.test(donation.estimatedValue.toString())) {
      return 'Estimated value must not contain more than 2 decimal places';
    }

    const donorAccountErr: string = this._accountHelper.validateAccount(donation.donorAccount, true);
    if (donorAccountErr) { return donorAccountErr; }

    const receiverAccountErr: string = this._accountHelper.validateAccount(donation.receiverAccount, true);
    if (receiverAccountErr) { return receiverAccountErr; }

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
      if (myAccount.id !== donation.receiverAccount.id) {
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
        && myAccount.id !== donation.receiverAccount.id
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
    return (donation.receiverAccount)
      ? this._accountHelper.accountName(donation.receiverAccount)
      : '';
  }

  receiverDetailsRouterLink(donation: Donation): string[] {
    return (donation.receiverAccount)
      ? this._accountHelper.accountDetailsRouterLink(donation.receiverAccount)
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
