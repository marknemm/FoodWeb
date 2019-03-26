import { ValidationHelper } from './validation-helper';
import { FoodWebError } from './food-web-error';
import { AccountHelper } from './account-helper';
import { Validation } from '../constants/validation';
import { Donation } from '../interfaces/donation/donation';
export { Donation };

export class DonationHelper {

  private _validationHelper = new ValidationHelper();
  private _accountHelper = new AccountHelper();

  validateDonation(donation: Donation): void {
    if (!donation) { return; }
    this._validationHelper.validateRequiredFields(
      donation,
      ['donorAccount', 'donorLastName', 'donorFirstName', 'donationType', 'description', 'estimatedValue', 'donationStatus'],
      ['Donor account', 'Donor last name', 'Donor first name', 'Donation type', 'Donation description', 'Estimated value', 'Donation status']
    );
    if (donation.donationStatus !== 'Unmatched' && !donation.receiverAccount) {
      throw new FoodWebError('Receiver account required for matched donation');
    }
    if (!Validation.DONATION_STATUS_REGEX.test(donation.donationStatus)) {
      throw new FoodWebError('Invalid donation status');
    }
    if (donation.estimatedValue < 0) {
      throw new FoodWebError('Estimated value must be positive');
    }
    if (!Validation.MONEY_REGEX.test(donation.estimatedValue.toString())) {
      throw new FoodWebError('Estimated value must not contain more than 2 decimal places');
    }
    this._accountHelper.validateAccount(donation.donorAccount, true);
    this._accountHelper.validateAccount(donation.receiverAccount, true);
  }
}
