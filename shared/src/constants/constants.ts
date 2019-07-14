import { AccountType } from './../interfaces/account/account';
import { DonationStatus } from '../interfaces/donation/donation';
import { AuditEventType } from '../interfaces/audit/audit';
import { Weekday } from '../interfaces/account/operation-hours';

export class Constants {
  readonly WEEKDAYS: Weekday[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  readonly ACCOUNT_TYPES: AccountType[] = ['Donor', 'Receiver', 'Volunteer'];
  readonly DONATION_TYPES = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];
  readonly DONATION_STATUSES: DonationStatus[] = ['Unmatched', 'Matched', 'Scheduled', 'Picked Up', 'Complete'];
  readonly AUDIT_EVENT_TYPES: AuditEventType[] = [
    'Signup',
    'Verify Account',
    'Remove Unverified Account',
    'Update Account',
    'Update Password',
    'Reset Password',
    'Donate',
    'Update Donation',
    'Remove Donation',
    'Claim Donation',
    'Unclaim Donation',
    'Schedule Delivery',
    'Delivery State Advance',
    'Delivery State Undo'
  ];
}
