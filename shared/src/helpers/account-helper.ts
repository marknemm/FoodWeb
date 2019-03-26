import { Account, ContactInfo, Organization, OperationHours } from '../interfaces/account/account';
import { Validation } from '../constants/validation';
import { ValidationHelper } from './validation-helper';
import { FoodWebError } from './food-web-error';
export { Account };

export class AccountHelper {

  private _validationHelper = new ValidationHelper();

  isAdmin(account: Account): boolean {
    return (account && account.accountType === 'Admin');
  }

  isDonor(account: Account, ignoreAdmin = false): boolean {
    return (account && (account.accountType === 'Donor' || (!ignoreAdmin && this.isAdmin(account))));
  }

  isReceiver(account: Account, ignoreAdmin = false): boolean {
    return (account && (account.accountType === 'Receiver' || (!ignoreAdmin && this.isAdmin(account))));
  }

  isMyAccount(myAccount: Account, accountId: number, ignoreAdmin = false): boolean {
    return (myAccount && (myAccount.id === accountId || (!ignoreAdmin && this.isAdmin(myAccount))));
  }

  validateAccount(account: Account, allowAdminAccountType = false): void {
    if (!account) { return; }
    this._validationHelper.validateRequiredFields(
      account,
      ['username', 'accountType', 'contactInfo', 'operationHours'],
      ['Username', 'Account type', 'Contact info', 'Operation hours']
    );
    // Organization is only required for 'Donor' and 'Receiver' type accounts.
    if (['Donor', 'Receiver'].indexOf(account.accountType) >= 0 && !account.organization) {
      throw new FoodWebError('Organization required');
    }
    if (!Validation.ACCOUNT_TYPE_REGEX.test(account.accountType) && (account.accountType !== 'Admin' || allowAdminAccountType)) {
      throw new FoodWebError('Invalid account type');
    }
    this.validateContactInfo(account.contactInfo);
    this.validateOrganization(account.organization);
    this.validateOperationHours(account.operationHours);
  }

  validateContactInfo(contactInfo: ContactInfo): void {
    if (!contactInfo) { return; }
    // Check to ensure all required fields exist.
    this._validationHelper.validateRequiredFields(
      contactInfo,
      ['email', 'phoneNumber', 'streetAddress', 'city', 'stateProvince', 'postalCode'],
      ['Email address', 'Phone number', 'Street address', 'City', 'State or province', 'Postal code']
    );
    // Check to ensure all fields conform to validation regexs.
    this._validationHelper.validateRegexFields(
      contactInfo,
      ['email', 'phoneNumber', 'postalCode'],
      ['email address', 'phone number', 'postal code'],
      [Validation.EMAIL_REGEX, Validation.PHONE_REGEX, Validation.POSTAL_CODE_REGEX]
    );
  }

  validateOrganization(organization: Organization): void {
    if (!organization) { return; }
    if (!organization.organizationName) {
      throw new FoodWebError('Organization name required');
    }
  }

  validateOperationHours(operationHours: OperationHours[]): void {
    if (!operationHours) { return; }
    operationHours.forEach((operationHoursEntry: OperationHours) => {
      if (!operationHoursEntry) {
        throw new FoodWebError('Operation hours entry missing');
      }
      this.validateOperationHoursEntry(operationHoursEntry);
    });
  }

  validateOperationHoursEntry(operationHoursEntry: OperationHours): void {
    if (!operationHoursEntry) { return; }
    if (!operationHoursEntry.weekday) {
      throw new FoodWebError('Weekday required in operation hours entry');
    }
    if (!operationHoursEntry.startTime) {
      throw new FoodWebError('Start time required in operation hours entry');
    }
    if (!operationHoursEntry.endTime) {
      throw new FoodWebError('End time required in operation hours entry');
    }
    if (new Date(operationHoursEntry.startTime) > new Date(operationHoursEntry.endTime)) {
      throw new FoodWebError('Start time must be earlier than end time in operation hours entry');
    }
  }

  validatePassword(password: string): void {
    if (!Validation.PASSWORD_REGEX.test(password)) {
      throw new FoodWebError('Password must contain at least 6 characters');
    }
  }
}
