import { DateTimeRange } from '../date-time/time';
import { AccountType } from './account';

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
   * Whether or not this account is configured to auto-receive donations.
   */
  autoReceiver?: boolean;
  /**
   * 
   */
  distanceRangeMi?: number;
  /**
   * The (primary) email associated with the account.
   */
  email?: string;
  lat?: number;
  lon?: number;
  operationHoursRange?: DateTimeRange;
  /**
   * The organization name associated with the account.
   */
  organizationName?: string;
  /**
   * The account's username.
   */
  username?: string;
}
