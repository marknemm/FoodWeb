import { ACCOUNT_TYPES } from '../interfaces/account/account';
import { AccountProfileImgPlaceholder } from '../interfaces/account/account-profile-img-placeholder';
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

  readonly ACCOUNT_PROFILE_IMG_PLACEHOLDERS: { [letter: string]: AccountProfileImgPlaceholder } = {
    A: { backgroundColor: '#00bfa5', color: '#fff', letter: 'A' },
    B: { backgroundColor: '#6200ea', color: '#fff', letter: 'B' },
    C: { backgroundColor: '#ffd600', color: '#fff', letter: 'C' },
    D: { backgroundColor: '#263238', color: '#fff', letter: 'D' },
    E: { backgroundColor: '#aa00ff', color: '#fff', letter: 'E' },
    F: { backgroundColor: '#c51162', color: '#fff', letter: 'F' },
    G: { backgroundColor: '#2962ff', color: '#fff', letter: 'G' },
    H: { backgroundColor: '#00c853', color: '#fff', letter: 'H' },
    I: { backgroundColor: '#ffab00', color: '#fff', letter: 'I' },
    J: { backgroundColor: '#0091ea', color: '#fff', letter: 'J' },
    K: { backgroundColor: '#3e2723', color: '#fff', letter: 'K' },
    L: { backgroundColor: '#304ffe', color: '#fff', letter: 'L' },
    M: { backgroundColor: '#d50000', color: '#fff', letter: 'M' },
    N: { backgroundColor: '#aeea00', color: '#fff', letter: 'N' },
    O: { backgroundColor: '#263238', color: '#fff', letter: 'O' },
    P: { backgroundColor: '#dd2c00', color: '#fff', letter: 'P' },
    Q: { backgroundColor: '#212121', color: '#fff', letter: 'Q' },
    R: { backgroundColor: '#ff6d00', color: '#fff', letter: 'R' },
    S: { backgroundColor: '#00b8d4', color: '#fff', letter: 'S' },
    T: { backgroundColor: '#00bfa5', color: '#fff', letter: 'T' },
    U: { backgroundColor: '#6200ea', color: '#fff', letter: 'U' },
    V: { backgroundColor: '#ffd600', color: '#fff', letter: 'V' },
    W: { backgroundColor: '#64dd17', color: '#fff', letter: 'W' },
    X: { backgroundColor: '#aa00ff', color: '#fff', letter: 'X' },
    Y: { backgroundColor: '#c51162', color: '#fff', letter: 'Y' },
    Z: { backgroundColor: '#2962ff', color: '#fff', letter: 'Z' },
  };

}
