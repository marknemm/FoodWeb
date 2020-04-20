import { ACCOUNT_TYPES } from '../interfaces/account/account';
import { Weekday } from '../interfaces/account/operation-hours';
import { AuditEventType } from '../interfaces/audit/audit';
import { DonationStatus, DONATION_STATUSES, DONATION_TYPES } from '../interfaces/donation/donation';
import { NotificationType, NOTIFICATION_TYPES } from '../interfaces/notification/notification';

export class Constants {
  
  readonly ACCOUNT_TYPES = ACCOUNT_TYPES;

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

  readonly DONATION_STATUSES: DonationStatus[] = DONATION_STATUSES;

  readonly DONATION_TYPES: string[] = DONATION_TYPES;

  readonly NOTIFICATION_TYPES: NotificationType[] = NOTIFICATION_TYPES;

  readonly WEEKDAYS: Weekday[] = [
    Weekday.Sunday,
    Weekday.Monday,
    Weekday.Tuesday,
    Weekday.Wednesday,
    Weekday.Thursday,
    Weekday.Friday,
    Weekday.Saturday
  ];

}
