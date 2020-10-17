import { Constants } from '../constants/constants';
import { Validation } from '../constants/validation';
import { AccountType } from '../interfaces/account/account';
import { Donation, DonationStatus } from '../interfaces/donation/donation';
import { DonationReadRequest } from '../interfaces/donation/donation-read-request';
import { Account, AccountHelper } from './account-helper';
import { DeliveryHelper } from './delivery-helper';
import { ValidationHelper } from './validation-helper';
export { Donation };

export class DonationHelper {

  private _accountHelper = new AccountHelper();
  private _constants = new Constants();
  private _deliveryHelper = new DeliveryHelper();
  private _validationHelper = new ValidationHelper();

  /**
   * Validates a given donation by inspecting the values of its contained properties.
   * @param donation The donation that is to be validated.
   * @return The error string if the donation is invalid, an empty string if valid.
   */
  validateDonation(donation: Partial<Donation>): string {
    if (!donation) { return ''; }

    const baseDonationErr: string = this._validateBaseDonation(donation);
    if (baseDonationErr) { return baseDonationErr; }

    const donationStatusErr: string = this._validateDonationStatus(donation);
    if (donationStatusErr) { return donationStatusErr; }

    const pickupWindowErr: string = this._validatePickupWindow(donation.pickupWindowStart, donation.pickupWindowEnd);
    if (pickupWindowErr) { return pickupWindowErr; }

    const donorAccountErr: string = this._validateDonorAccount(donation.donorAccount);
    if (donorAccountErr) { return donorAccountErr; }

    const donorContactOverrideErr: string = this._accountHelper.validateContactInfo(donation.donorContactOverride);
    if (donorContactOverrideErr) { return donorContactOverrideErr; }

    const deliveryErr: string = this._deliveryHelper.validateDelivery(donation.claim?.delivery, donation.donationStatus);
    if (deliveryErr) { return deliveryErr; }

    return '';
  }

  private _validateBaseDonation(donation: Partial<Donation>): string {
    const requireErr: string = this._validationHelper.validateProps(
      donation,
      [
        'donorAccount', 'donorLastName', 'donorFirstName', 'donationType',
        { prop: 'description', name: 'donation description' }
      ]
    );
    if (requireErr) { return requireErr; }

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

  private _validateDonationStatus(donation: Partial<Donation>): string {
    const requiredErr: string = this._validationHelper.validateProps(donation, ['donationStatus']);
    if (requiredErr) { return requiredErr; }

    switch (donation.donationStatus) {
      case DonationStatus.Unmatched:
        if (donation.claim) {
          return `A donation with status '${donation.donationStatus}' cannot have a donation claim`;
        }
        break;
      case DonationStatus.Matched:
        if (!donation.claim) {
          return `A donation with status '${donation.donationStatus}' must have a donation claim`;
        }
        break;
      case DonationStatus.Scheduled:
        if (!donation.claim?.delivery) {
          return `A donation with status '${donation.donationStatus}' must have a donation delivery setup`;
        }
        if (donation.claim.delivery.startTime) {
          return `A donation with status '${donation.donationStatus}' must not have a delivery start time`;
        }
        break;
      case DonationStatus.Started:
        if (!donation.claim?.delivery?.startTime) {
          return `A donation with status '${donation.donationStatus}' must have a delivery start time`;
        }
        if (donation.claim.delivery.pickupTime) {
          return `A donation with status '${donation.donationStatus}' must not have a delivery pickup time`;
        }
        break;
      case DonationStatus.PickedUp:
        if (!donation.claim?.delivery?.pickupTime) {
          return `A donation with status '${donation.donationStatus}' must have a delivery pickup time`;
        }
        if  (donation.claim.delivery.dropOffTime) {
          return `A donation with status '${donation.donationStatus}' must not have a delivery drop-off time`;
        }
        break;
      case DonationStatus.Complete:
        if (!donation.claim?.delivery?.dropOffTime) {
          return `A donation with status '${donation.donationStatus}' must have a delivery drop-off time`;
        }
        break;
      default:
        return `'${donation.donationStatus}' is an unknown donation status`;
    }
  }

  private _validatePickupWindow(pickupWindowStart: Date, pickupWindowEnd: Date): string {
    if (!pickupWindowStart) {
      return 'Pickup window start is required';
    }
    if (!pickupWindowEnd) {
      return 'Pickup window end is required';
    }
    if (pickupWindowStart >= pickupWindowEnd) {
      return 'Pickup window start time must be later than end time';
    }
    return '';
  }

  private _validateDonorAccount(donorAccount: Partial<Account>): string {
    if (!donorAccount) {
      return 'Donation must have a donor account.';
    }
    if (donorAccount.id == null) {
      return 'Donation donor account must have an ID present.';
    }
    return '';
  }

  validateDonationEditPrivilege(donation: Partial<Donation>, actingAccount: Account): string {
    if (!actingAccount || donation.donorAccount.id !== actingAccount.id) {
      return 'You do not own the donation';
    }
    if (this.isDonationStatusLaterThan(donation, DonationStatus.Scheduled)) {
      return 'Cannot edit a donation that has been picked up';
    }
    return '';
  }

  validateDonationDeletePrivilege(donation: Partial<Donation>, actingAccount: Account): string {
    if (!actingAccount || donation.donorAccount.id !== actingAccount.id) {
      return 'You do not own the donation';
    }
    if (this.isDonationStatusLaterThan(donation, DonationStatus.Scheduled)) {
      return 'Cannot delete a donation that has been picked up';
    }
    return '';
  }

  validateDonationClaimPrivilege(donation: Partial<Donation>, actingAccount: Account): string {
    if (actingAccount?.accountType !== AccountType.Receiver) {
      return 'Only a Receiver account can claim a donation';
    }
    if (donation?.donationStatus !== DonationStatus.Unmatched) {
      return 'Cannot claim a donation that has already been claimed';
    }
    return '';
  }

  validateDonationUnclaimPrivilege(donation: Partial<Donation>, actingAccount: Account): string {
    if (donation.donationStatus === DonationStatus.Unmatched) {
      return 'You cannot unclaimed a donation that has not been claimed';
    }
    if (!actingAccount || actingAccount.id !== donation.claim.receiverAccount.id) {
      return 'You do not own the donation claim';
    }
    if (this.isDonationStatusLaterThan(donation, DonationStatus.Scheduled)) {
      return 'Cannot unclaim a completed donation';
    }
    return '';
  }

  validateDeliveryCancelPrivilege(donation: Partial<Donation>, actingAccount: Account): string {
    if (donation.donationStatus !== DonationStatus.Scheduled) {
      return 'You cannot cancel a delivery that is not in a scheduled state';
    }
    if (
      !actingAccount
      || (
        actingAccount.id !== donation.claim.delivery.volunteerAccount.id
        && actingAccount.id !== donation.claim.receiverAccount.id
        && actingAccount.id !== donation.donorAccount.id
      )
    ) {
      return 'You did not schedule the delivery';
    }
  }

  isDonationStatusLaterThan(toCheck: Partial<Donation> | DonationStatus, compareStatus: DonationStatus): boolean {
    const toCheckStatus: DonationStatus = (typeof toCheck === 'object') ? toCheck.donationStatus : toCheck;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(toCheckStatus);
    const compareStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(compareStatus);
    return (curStatusIdx > compareStatusIdx);
  }

  isDonationStatusEarlierThan(toCheck: Partial<Donation> | DonationStatus, compareStatus: DonationStatus): boolean {
    const toCheckStatus: DonationStatus = (typeof toCheck === 'object') ? toCheck.donationStatus : toCheck;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(toCheckStatus);
    const compareStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(compareStatus);
    return (curStatusIdx < compareStatusIdx);
  }

  isDonationDonor(donation: Partial<Donation>, account: Partial<Account>): boolean {
    return (donation?.donorAccount.id === account?.id);
  }

  isDonationReceiver(donation: Partial<Donation>, account: Partial<Account>): boolean {
    return (donation?.claim?.receiverAccount.id === account?.id);
  }

  isDonationVolunteer(donation: Partial<Donation>, account: Partial<Account>): boolean {
    return (donation?.claim?.delivery?.volunteerAccount.id === account?.id);
  }

  getNextDonationStatus(nextOf: Partial<Donation> | DonationStatus): DonationStatus {
    const nextOfStatus: DonationStatus = (typeof nextOf === 'object') ? nextOf.donationStatus : nextOf;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(nextOfStatus);
    return (curStatusIdx !== this._constants.DONATION_STATUSES.length)
      ? this._constants.DONATION_STATUSES[curStatusIdx + 1]
      : null;
  }

  getPrevDonationStatus(prevOf: Partial<Donation> | DonationStatus): DonationStatus {
    const prevOfStatus: DonationStatus = (typeof prevOf === 'object') ? prevOf.donationStatus : prevOf;
    const curStatusIdx: number = this._constants.DONATION_STATUSES.indexOf(prevOfStatus);
    return (curStatusIdx > 0)
      ? this._constants.DONATION_STATUSES[curStatusIdx - 1]
      : null;
  }

  findDonationsQueryParams(account: Partial<Account>): DonationReadRequest {
    switch (account?.accountType) {
      case AccountType.Receiver:  return { donationStatus: DonationStatus.Unmatched };
      case AccountType.Volunteer: return { donationStatus: DonationStatus.Matched };
    }
    return {};
  }

  memberAccountsArr(donation: Partial<Donation>): Account[] {
    const { donorAccount, receiverAccount, volunteerAccount } = this.memberAccounts(donation);
    const memberAccounts: Account[] = [donorAccount];
    if (receiverAccount) {
      memberAccounts.push(receiverAccount);
      if (volunteerAccount) {
        memberAccounts.push(volunteerAccount);
      }
    }
    return memberAccounts;
  }

  memberAccounts(donation: Partial<Donation>): DonationAccounts {
    return {
      donorAccount: this.donorAccout(donation),
      receiverAccount: this.receiverAccount(donation),
      volunteerAccount: this.volunteerAccount(donation)
    };
  }

  donorAccout(donation: Partial<Donation>): Account {
    return donation?.donorAccount;
  }

  receiverAccount(donation: Partial<Donation>): Account {
    return donation?.claim?.receiverAccount;
  }

  volunteerAccount(donation: Partial<Donation>): Account {
    return donation?.claim?.delivery?.volunteerAccount;
  }

  memberName(donation: Partial<Donation>, accountType: AccountType): string {
    switch (accountType) {
      case AccountType.Donor:     return this.donorName(donation);
      case AccountType.Receiver:  return this.receiverName(donation);
      case AccountType.Volunteer: return this.delivererName(donation);
      default:                    throw new Error(`Incorrect account type argument: ${accountType}`);
    }
  }

  memberNames(donation: Partial<Donation>): { donorName: string, receiverName?: string, delivererName?: string } {
    return {
      donorName: this.donorName(donation),
      receiverName: this.receiverName(donation),
      delivererName: this.delivererName(donation)
    };
  }

  donorName(donation: Partial<Donation>): string {
    return this._accountHelper.accountName(donation.donorAccount);
  }

  donorDetailsRouterLink(donation: Partial<Donation>): string[] {
    return this._accountHelper.accountDetailsRouterLink(donation.donorAccount);
  }

  receiverName(donation: Partial<Donation>): string {
    return this._accountHelper.accountName(donation.claim?.receiverAccount);
  }

  receiverDetailsRouterLink(donation: Partial<Donation>): string[] {
    return this._accountHelper.accountDetailsRouterLink(donation.claim?.receiverAccount);
  }

  delivererName(donation: Partial<Donation>): string {
    return this._accountHelper.accountName(donation.claim?.delivery?.volunteerAccount);
  }

  delivererDetailsRouterLink(donation: Partial<Donation>): string[] {
    return this._accountHelper.accountDetailsRouterLink(donation.claim?.delivery?.volunteerAccount);
  }

  hasDonorContactInfoOverride(donation: Partial<Donation>): boolean {
    return (donation?.donorContactOverride?.id !== donation?.donorAccount?.contactInfo?.id);
  }
}

export interface DonationAccounts {
  donorAccount: Account;
  receiverAccount: Account;
  volunteerAccount: Account;
}
