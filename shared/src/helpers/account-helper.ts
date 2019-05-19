import { Account, ContactInfo, Organization, OperationHours, Volunteer } from '../interfaces/account/account';
import { Validation } from '../constants/validation';
import { ValidationHelper } from './validation-helper';
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

  isVolunteer(account: Account, ignoreAdmin = false): boolean {
    return (account && (account.accountType === 'Volunteer' || (!ignoreAdmin && this.isAdmin(account))));
  }

  isMyAccount(myAccount: Account, accountId: number, ignoreAdmin = false): boolean {
    return (myAccount && (myAccount.id === accountId || (!ignoreAdmin && this.isAdmin(myAccount))));
  }

  organizationFirstChar(organization: Organization): string {
    return organization.organizationName.substr(0, 1).toUpperCase();
  }

  validateAccount(account: Account, allowAdminAccountType = false): string {
    if (!account) { return ''; }

    const requireErr: string = this._validationHelper.validateRequiredFields(
      account,
      ['username', 'accountType', 'contactInfo', 'operationHours'],
      ['Username', 'Account type', 'Contact info', 'Operation hours']
    );
    if (requireErr) { return requireErr; }

    // Organization is only required for 'Donor' and 'Receiver' type accounts.
    if (['Donor', 'Receiver'].indexOf(account.accountType) >= 0) {
      if (!account.organization) {
        return 'Organization required';
      }

      const organizationErr: string = this.validateOrganization(account.organization);
      if (organizationErr) { return organizationErr; }
    }
    if (account.accountType === 'Volunteer') {
      if (!account.volunteer) {
        return 'Volunteer info required';
      }

      const volunteerErr: string = this.validateVolunteer(account.volunteer);
      if (volunteerErr) { return volunteerErr; }
    }
    if (!Validation.ACCOUNT_TYPE_REGEX.test(account.accountType) && (account.accountType !== 'Admin' || allowAdminAccountType)) {
      return 'Invalid account type';
    }

    const contactInfoErr: string = this.validateContactInfo(account.contactInfo);
    if (contactInfoErr) { return contactInfoErr; }

    const opHoursErr: string = this.validateOperationHours(account.operationHours);
    if (opHoursErr) { return opHoursErr; }

    return '';
  }

  validateContactInfo(contactInfo: ContactInfo): string {
    if (!contactInfo) { return ''; }
    
    // Check to ensure all required fields exist.
    const requireErr: string = this._validationHelper.validateRequiredFields(
      contactInfo,
      ['email', 'phoneNumber', 'streetAddress', 'city', 'stateProvince', 'postalCode'],
      ['Email address', 'Phone number', 'Street address', 'City', 'State or province', 'Postal code']
    );
    if (requireErr) { return requireErr; }

    // Check to ensure all fields conform to validation regexs.
    const patternErr: string = this._validationHelper.validateRegexFields(
      contactInfo,
      ['email', 'phoneNumber', 'postalCode'],
      ['email address', 'phone number', 'postal code'],
      [Validation.EMAIL_REGEX, Validation.PHONE_REGEX, Validation.POSTAL_CODE_REGEX]
    );
    if (patternErr) { return patternErr; }

    return '';
  }

  validateOrganization(organization: Organization): string {
    if (!organization) { return ''; }
    if (!organization.organizationName) {
      return 'Organization name required';
    }
    return '';
  }

  validateVolunteer(volunteer: Volunteer): string {
    if (!volunteer) { return ''; }
    if (!volunteer.firstName) {
      return 'First name required';
    }
    if (!volunteer.lastName) {
      return 'Last name required';
    }
    return '';
  }

  validateOperationHours(operationHours: OperationHours[]): string {
    if (!operationHours) { return ''; }
    let operationHoursEntry: OperationHours;
    for (operationHoursEntry of operationHours) {
      if (!operationHoursEntry) {
        return 'Operation hours entry missing';
      }
      const opHourEntryErr: string = this.validateOperationHoursEntry(operationHoursEntry);
      if (opHourEntryErr) { return opHourEntryErr; }
    }
    return '';
  }

  validateOperationHoursEntry(operationHoursEntry: OperationHours): string {
    if (!operationHoursEntry) { return ''; }
    if (!operationHoursEntry.weekday) {
      return 'Weekday required in operation hours entry';
    }
    if (!operationHoursEntry.startTime) {
      return 'Start time required in operation hours entry';
    }
    if (!operationHoursEntry.endTime) {
      return 'End time required in operation hours entry';
    }
    if (new Date(operationHoursEntry.startTime) > new Date(operationHoursEntry.endTime)) {
      return 'Start time must be earlier than end time in operation hours entry';
    }
    return '';
  }

  validatePassword(password: string): string {
    if (!Validation.PASSWORD_REGEX.test(password)) {
      return 'Password must contain at least 6 characters';
    }
    return '';
  }
}
