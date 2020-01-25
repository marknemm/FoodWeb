import { Account, ContactInfo, Organization, OperationHours, Volunteer, AccountType } from '../interfaces/account/account';
import { Validation } from '../constants/validation';
import { ValidationHelper } from './validation-helper';
export { Account };

export class AccountHelper {

  private _validationHelper = new ValidationHelper();

  isAdmin(account: Account): boolean {
    return (account && account.accountType === AccountType.Admin);
  }

  isDonor(account: Account): boolean {
    return (account && (account.accountType === AccountType.Donor));
  }

  isReceiver(account: Account): boolean {
    return (account && (account.accountType === AccountType.Receiver));
  }

  isVolunteer(account: Account): boolean {
    return (account && (account.accountType === AccountType.Volunteer));
  }

  isMyAccount(myAccount: Account, accountId: number): boolean {
    return (myAccount && (myAccount.id === accountId));
  }

  organizationFirstChar(organization: Organization): string {
    return organization.organizationName.substr(0, 1).toUpperCase();
  }

  accountName(account: Account): string {
    return (account.accountType === AccountType.Donor || account.accountType === AccountType.Receiver)
      ? account.organization.organizationName
      : `${account.volunteer.firstName} ${account.volunteer.lastName}`;
  }

  accountDetailsRouterLink(account: Account): string[] {
    return ['/account/details/', `${account.id}`];
  }

  areContactInfosEqual(contactInfoLhs: ContactInfo, contactInfoRhs: ContactInfo): boolean {
    if (contactInfoLhs !== contactInfoRhs && (!contactInfoLhs || !contactInfoRhs)) {
      return false;
    }
    return this.areAddressesEqual(contactInfoLhs, contactInfoRhs)
        && (contactInfoLhs.phoneNumber === contactInfoRhs.phoneNumber)
        && (contactInfoLhs.email === contactInfoRhs.email);
  }
  
  areAddressesEqual(contactInfoLhs: ContactInfo, contactInfoRhs: ContactInfo): boolean {
    if (contactInfoLhs !== contactInfoRhs && (!contactInfoLhs || !contactInfoRhs)) {
      return false;
    }
    return (contactInfoLhs.streetAddress === contactInfoRhs.streetAddress)
        && (contactInfoLhs.city === contactInfoRhs.city)
        && (contactInfoLhs.stateProvince === contactInfoRhs.stateProvince)
        && (contactInfoLhs.postalCode === contactInfoRhs.postalCode);
  }

  formatPhoneNumber(phoneNumber: string): string {
    phoneNumber = phoneNumber.trim();
    let basePhoneNumber: string = phoneNumber;

    // Remove country code for America
    basePhoneNumber = basePhoneNumber.replace(/^\+\s*1\s*/, '');

    let countryCode: string = this._extractRegex(basePhoneNumber, /^\+\s*\d+\s+/);
    basePhoneNumber = basePhoneNumber.replace(countryCode, '');
    const countryCodeNumber: string = this._extractRegex(countryCode, /\d+/);
    countryCode = (countryCodeNumber ? `+${countryCodeNumber}` : countryCode);

    let extension: string = this._extractRegex(basePhoneNumber, /[a-zA-Z].*/);
    basePhoneNumber = basePhoneNumber.replace(extension, '');
    const extensionNumber: string = this._extractRegex(extension, /\d+/);
    extension = (extensionNumber ? `ext. ${extensionNumber}` : extension);

    // By this point, basePhoneNumber should be full phone number minus any country code and/or extension.
    const baseDigits: string[] = basePhoneNumber.match(/\d/g);

    // Only continue with formatting if we can isolate a phone number with 7 or 10 base digits; if continue, we may ruin the number.
    if (baseDigits && (baseDigits.length == 10 || baseDigits.length == 7)) {
      const areaCodeNumber: string = (baseDigits.length == 10)
        ? `(${baseDigits.slice(0, 3).join('')})`
        : '';

      // Now we can finally extract the actual basePhoneNumber (no country/area code or extension).
      basePhoneNumber = (baseDigits.length == 10)
        ? baseDigits.slice(3, 10).join('')
        : baseDigits.join('');

      const basePhoneNumberBegin: string = basePhoneNumber.substring(0, 3);
      const basePhoneNumberEnd: string = basePhoneNumber.substring(3);
      phoneNumber = `${countryCode} ${areaCodeNumber} ${basePhoneNumberBegin}-${basePhoneNumberEnd} ${extension}`.trim();
    }

    return phoneNumber;
  }

  private _extractRegex(target: string, regex: RegExp): string {
    let matchSubstr = '';
    const matchResult: string[] = target.match(regex);
    if (matchResult) {
      matchSubstr = matchResult[0];
    }
    return matchSubstr;
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
    if ([AccountType.Donor, AccountType.Receiver].indexOf(account.accountType) >= 0) {
      if (!account.organization) {
        return 'Organization required';
      }

      const organizationErr: string = this.validateOrganization(account.organization, account.accountType);
      if (organizationErr) { return organizationErr; }
    }
    if (account.accountType === AccountType.Volunteer) {
      if (!account.volunteer) {
        return 'Volunteer info required';
      }

      const volunteerErr: string = this.validateVolunteer(account.volunteer);
      if (volunteerErr) { return volunteerErr; }
    }
    if (!Validation.ACCOUNT_TYPE_REGEX.test(account.accountType) && (account.accountType !== AccountType.Admin || allowAdminAccountType)) {
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

  validateOrganization(organization: Organization, accountType: AccountType): string {
    if (!organization) { return ''; }
    if (!organization.organizationName) {
      return 'Organization name required';
    }
    if (accountType === AccountType.Donor) {
      if (!organization.donor) {
        return 'Donor organization field required for Donor account type';
      }
      if (organization.receiver) {
        return 'Receiver organization field should not be present for Donor account type';
      }
    } else if (accountType === AccountType.Receiver) {
      if (!organization.receiver) {
        return 'Receiver organization field required for Receiver account type';
      }
      if (organization.donor) {
        return 'Donor organization field should not be present for Receiver account type';
      }
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
