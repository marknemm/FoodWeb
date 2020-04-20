import { AccountType } from './account';
import { Weekday } from './operation-hours';

/**
 * Common filters for querying accounts.
 */
export interface AccountReadFilters {
  /**
   * The auto-generated database ID for the account.
   */
  id?: number;
  /**
   * The account type ('Donor', 'Receiver', 'Volunteer').
   */
  accountType?: AccountType;
  /**
   * Whether or not the (volunteer) account has been marked as having signed the waiver/agreement (attended training).
   */
  signedAgreement?: 'true' | 'false' | boolean;
  /**
   * Whether or not this account is configured to auto-receive donations.
   */
  autoReceiver?: boolean;
  distanceRangeMi?: number;
  /**
   * The (primary) email associated with the account.
   */
  email?: string;
  /**
   * The (GPS) latitude of the address associated with the account.
   */
  lat?: number;
  /**
   * The (GPS) longitude of the address associated with the account.
   */
  lon?: number;
  /**
   * The weekday of the range of operation hours that an account's operation hours range(s) must overlap with.
   */
  operationHoursWeekday?: Weekday;
  /**
   * The start time of the range of operation hours that an account's operation hours range(s) must overlap with.
   */
  operationHoursStartTime?: string;
  /**
   * The end time of the range of operation hours that an account's operation hours range(s) must overlap with.
   */
  operationHoursEndTime?: string;
  /**
   * The organization name associated with the account.
   */
  organizationName?: string;
  /**
   * The account's username.
   */
  username?: string;
  /**
   * Whether or not the account has been verified.
   */
  verified?: 'true' | 'false' | boolean;
  /**
   * The first name of the volunteer.
   */
  volunteerFirstName?: string;
  /**
   * The last name of the volunteer.
   */
  volunteerLastName?: string;
}
