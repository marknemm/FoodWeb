import { AccountType } from './../interfaces/account/account';
import { DonationStatus } from '../interfaces/donation/donation';
import { AuditEventType } from '../interfaces/audit/audit';
import { Weekday } from '../interfaces/account/operation-hours';

export class Constants {
  readonly WEEKDAYS: Weekday[] = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday
  ];

  readonly ACCOUNT_TYPES: AccountType[] = [
    AccountType.Donor,
    AccountType.Receiver,
    AccountType.Volunteer
  ];

  readonly DONATION_TYPES = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];

  readonly DONATION_STATUSES: DonationStatus[] = [
    DonationStatus.Unmatched,
    DonationStatus.Matched,
    DonationStatus.Scheduled,
    DonationStatus.PickedUp,
    DonationStatus.Complete
  ];

  readonly AUDIT_EVENT_TYPES: AuditEventType[] = [
    AuditEventType.Signup,
    AuditEventType.VerifyAccount,
    AuditEventType.RemoveUnverifiedAccount,
    AuditEventType.UpdateAccount,
    AuditEventType.UpdatePassword,
    AuditEventType.ResetPassword,
    AuditEventType.Donate,
    AuditEventType.UpdateDonation,
    AuditEventType.RemoveDonation,
    AuditEventType.ClaimDonation,
    AuditEventType.UnclaimDonation,
    AuditEventType.ScheduleDelivery,
    AuditEventType.DeliveryStateAdvance,
    AuditEventType.DeliveryStateUndo
  ];
}
