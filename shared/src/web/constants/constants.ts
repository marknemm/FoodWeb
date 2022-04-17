import { AccountCategory, AccountType } from '../interfaces/account/account';
import { AccountProfileImgPlaceholder } from '../interfaces/account/account-profile-img-placeholder';
import { Weekday } from '../interfaces/account/operation-hours';
import { AuditEventType } from '../interfaces/audit/audit';
import { DonationStatus } from '../interfaces/donation/donation';
import { NotificationType } from '../interfaces/notification/notification';

export class Constants {

  readonly ACCOUNT_CATEGORIES: AccountCategory[] = Object.values(AccountCategory);
  readonly ACCOUNT_CATEGORY_MEMBERS = {
    Business: [AccountType.Donor, AccountType.Receiver],
    Volunteer: [AccountType.Volunteer]
  };
  readonly ACCOUNT_PROFILE_IMG_PLACEHOLDERS: { [letter: string]: AccountProfileImgPlaceholder } = {
    '0': { backgroundColor: '#00bfa5', color: '#fff', letter: '0' },
    '1': { backgroundColor: '#6200ea', color: '#fff', letter: '1' },
    '2': { backgroundColor: '#ffd600', color: '#fff', letter: '2' },
    '3': { backgroundColor: '#263238', color: '#fff', letter: '3' },
    '4': { backgroundColor: '#aa00ff', color: '#fff', letter: '4' },
    '5': { backgroundColor: '#c51162', color: '#fff', letter: '5' },
    '6': { backgroundColor: '#2962ff', color: '#fff', letter: '6' },
    '7': { backgroundColor: '#00c853', color: '#fff', letter: '7' },
    '8': { backgroundColor: '#3e2723', color: '#fff', letter: '9' },
    '9': { backgroundColor: '#304ffe', color: '#fff', letter: '9' },
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
  readonly ACCOUNT_TYPES: AccountType[] = Object.values(AccountType);

  readonly AUDIT_EVENT_TYPES: AuditEventType[] = Object.values(AuditEventType);

  readonly DONATION_STATUSES: DonationStatus[] = Object.values(DonationStatus);
  readonly DONATION_TYPES: string[] = ['Food', 'Merchandise', 'Cash', 'Service', 'Other'];

  readonly NOTIFICATION_TYPES: NotificationType[] = <NotificationType[]>Object.values(NotificationType);

  readonly WEEKDAYS: Weekday[] = Object.values(Weekday);

}
