import { AccountType } from './../interfaces/account/account';
import { DonationStatus } from '../interfaces/donation/donation';

export class Constants {
  readonly WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  readonly ACCOUNT_TYPES: AccountType[] = ['Donor', 'Receiver', 'Driver'];
  readonly DONATION_TYPES = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];
  readonly DONATION_STATUSES: DonationStatus[] = ['Unmatched', 'Matched', 'Complete'];
}
