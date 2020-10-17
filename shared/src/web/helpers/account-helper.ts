import { AccountProfileImgPlaceholder } from '../interfaces/account/account-profile-img-placeholder';
import { Validation } from '../constants/validation';
import { Account, AccountType, ContactInfo, OperationHours, Organization, Volunteer } from '../interfaces/account/account';
import { AccountAutocompleteItem } from '../interfaces/account/account-autocomplete-item';
import { ValidationHelper } from './validation-helper';
import { Constants } from '../constants/constants';
export { Account };

export class AccountHelper {

  private _constants = new Constants();
  private _validationHelper = new ValidationHelper();

  isDonor(account: Account): boolean {
    return (account?.accountType === AccountType.Donor);
  }

  isReceiver(account: Account): boolean {
    return (account?.accountType === AccountType.Receiver);
  }

  isVolunteer(account: Account): boolean {
    return (account?.accountType === AccountType.Volunteer);
  }

  doesAccountIdMatch(myAccount: Account, accountId: number): boolean {
    return (myAccount?.id === accountId);
  }

  organizationFirstChar(organization: Organization): string {
    return organization
      ? organization.name.substr(0, 1).toUpperCase()
      : '';
  }

  accountName(account: Account | AccountAutocompleteItem): string {
    if (account) {
      return ([AccountType.Donor, AccountType.Receiver].indexOf(account.accountType) >= 0)
        ? account.organization.name
        : `${account.volunteer.firstName} ${account.volunteer.lastName}`;
    }
    return '';
  }

  accountProfileImgPlaceholder(account: Account): AccountProfileImgPlaceholder {
    if (account && !account.profileImg) {
      const firstLetter: string = (account.accountType === 'Volunteer')
        ? account.volunteer.lastName.charAt(0).toUpperCase()
        : account.organization.name.charAt(0).toUpperCase();
      return this._constants.ACCOUNT_PROFILE_IMG_PLACEHOLDERS[firstLetter];
    }
    return { color: '', backgroundColor: '', letter: '' };
  }

  accountDetailsRouterLink(account: Account): string[] {
    return (account) ? ['/account/details/', `${account.id}`] : [];
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
    if (baseDigits && (baseDigits.length === 10 || baseDigits.length === 7)) {
      const areaCodeNumber: string = (baseDigits.length === 10)
        ? `(${baseDigits.slice(0, 3).join('')})`
        : '';

      // Now we can finally extract the actual basePhoneNumber (no country/area code or extension).
      basePhoneNumber = (baseDigits.length === 10)
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

  validateAccount(account: Account): string {
    if (!account) { return ''; }

    const requireErr: string = this._validationHelper.validateProps(account, ['username', 'accountType', 'contactInfo']);
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
    if (!Validation.ACCOUNT_TYPE_REGEX.test(account.accountType)) {
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

    // Check to ensure all required fields exist and contain values that fit various regex patterns.
    const validateErr: string = this._validationHelper.validateProps(
      contactInfo,
      [
        { prop: 'email', name: 'email address', required: true, regex: Validation.EMAIL_REGEX },
        { prop: 'phoneNumber', required: true, regex: Validation.PHONE_REGEX },
        'streetAddress',
        'city',
        { prop: 'stateProvince', name: 'state or province' },
        { prop: 'postalCode', required: true, regex: Validation.POSTAL_CODE_REGEX }
      ]
    );
    if (validateErr) { return validateErr; }

    return '';
  }

  validateOrganization(organization: Organization, accountType: AccountType): string {
    if (!organization) { return ''; }
    if (!organization.name) {
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
