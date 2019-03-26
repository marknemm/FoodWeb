import { AccountType } from './../interfaces/account/account';

export class Constants {
  readonly WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  readonly ACCOUNT_TYPES: AccountType[] = ['Donor', 'Receiver'];
  readonly DONATION_TYPES = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];
}
