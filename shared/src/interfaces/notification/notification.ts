import { AuditEventType } from '../audit/audit';

export enum NotificationType {
  Signup = AuditEventType.Signup,
  Donate = AuditEventType.Donate,
  UpdateDonation = AuditEventType.UpdateDonation,
  RemoveDonation = AuditEventType.RemoveDonation,
  ClaimDonation = AuditEventType.ClaimDonation,
  UnclaimDonation = AuditEventType.UnclaimDonation,
  ScheduleDelivery = AuditEventType.ScheduleDelivery,
  CancelDelivery = AuditEventType.CancelDelivery,
  DeliveryStateAdvance = AuditEventType.DeliveryStateAdvance,
  DeliveryStateUndo = AuditEventType.DeliveryStateUndo,
  DeliveryReminder = ('Delivery Reminder')
}

/**
 * A notification that can serve as an SMS Message, SSE Notification, Push Notification, or Web Notification.
 */
export interface Notification {
  id?: number;
  /**
   * The type of the notification. Helps direct user to a page in the app for more information/actions.
   */
  notificationType: NotificationType;
  /**
   * ID that helps direct the user to a page in the app for more information.
   */
  notificationDetailId: number;
  /**
   * (Deep) Link used for the notification.
   */
  notificationLink?: string;
  /**
   * A URL for the icon that should be used for the notification.
   */
  notificationIconUrl?: string;
  /**
   * The title of the notification.
   */
  notificationTitle: string;
  /**
   * The subtitle of the notification.
   */
  notificationSubtitle?: string;
  /**
   * The body of the notification.
   */
  notificationBody: string;
  /**
   * Whether or not the notification has been marked as read.
   */
  read?: boolean;
  /**
   * Whether or not the notification has been flagged.
   */
  flagged?: boolean;
  /**
   * The timestamp of when the notification was created.
   */
  timestamp?: Date;
}
