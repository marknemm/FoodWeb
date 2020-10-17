import { ContactInfo } from './contact-info';
import { OperationHours } from './operation-hours';
import { Organization } from './organization';
import { Volunteer } from './volunteer';
export { ContactInfo, OperationHours, Organization, Volunteer };

/**
 * An account, which represents any user on the platform.
 */
export interface Account {
  /**
   * The auto-generated integer ID of the account.
   */
  id?: number;
  /**
   * The type of the account.
   */
  accountType: AccountType;
  /**
   * Contact information associated with the account.
   */
  contactInfo: ContactInfo;
  /**
   * The integer ID of the notification that was last viewed within the web/app interface (excludes push notifications).
   * Used to determine how many unseen notifications are present.
   */
  lastSeenNotificationId?: number;
  /**
   * The profile image for the account. Either a URL of an explicitly set/uploaded profile image,
   * or a single letter that will act as a placeholder for the profile image.
   */
  profileImg: string;
  /**
   * A list of the (weekday) operation hours associated with the account.
   * If empty, then it assumed that a receiver/volunteer may operate at any hour.
   */
  operationHours?: OperationHours[];
  /**
   * The organization information associated with the account.
   * Will only be present for `Donor` & `Receiver` type accounts.
   */
  organization?: Organization;
  /**
   * The username of the account.
   */
  username: string;
  /**
   * A boolean flag specifying whether or not the account has been verified (via email signup confirmation link).
   */
  verified?: boolean;
  /**
   * The volunteer information associated with the account.
   * Will only be present for `Volunteer` type accounts.
   */
  volunteer?: Volunteer;
}

/**
 * The type of an account.
 */
export enum AccountType {
  Donor = 'Donor',
  Receiver = 'Receiver',
  Volunteer = 'Volunteer'
}

/**
 * A list of all possible account types.
 */
export const ACCOUNT_TYPES: AccountType[] = [
  AccountType.Donor,
  AccountType.Receiver,
  AccountType.Volunteer
];
