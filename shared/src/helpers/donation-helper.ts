import { ValidationHelper } from './validation-helper';
import { AccountHelper, Account } from './account-helper';
import { Validation } from '../constants/validation';
import { Donation } from '../interfaces/donation/donation';
export { Donation };

export class DonationHelper {

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
    if (myAccount.accountType !== 'Admin') {
      if (donation.donorAccount.id !== myAccount.id) {
        return 'You do not own the donation';
      }
      if (donation.donationStatus === 'Complete') {
        return 'Cannot edit/delete a completed donation';
      }
    }
    return '';
  }
}
