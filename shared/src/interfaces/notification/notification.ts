import { AuditEventType } from '../audit/audit';

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
   * The link that the user should be sent to when clicking on the notification.
   */
  notificationLink?: string;
  /**
   * The title of the notification.
   */
  title: string;
  /**
   * The subtitle of the notification.
   */
  subtitle?: string;
  /**
   * The body of the notification.
   */
  body: string;
  /**
   * A URL for the icon that should be used for the notification.
   */
  icon?: string;
  /**
   * The notification's icon color, expressed in #rrggbb format.
   */
  color?: string;
  /**
   * A URL for the full span image displayed within the notification.
   */
  image?: string;
  /**
   * The sound to be used for the notification. If not provided, then the system default is used.
   */
  sound?: string;
  /**
   * The priority of the notification. Defaults to 'high'.
   */
  priority?: 'high' | 'normal';
  /**
   * The key to the body string in the app's string resources to use to localize the body text to the user's current localization.
   */
  locKey?: string;
  /**
   * Variable string values to be used in place of the format specifiers in body_loc_key to use to localize the body text
   * to the user's current localization.
   */
  locArgs?: string;
  /**
   * The key to the title string in the app's string resources to use to localize the title text to the user's current localization.
   */
  titleLocKey?: string;
  /**
   * Variable string values to be used in place of the format specifiers in title_loc_key to use to localize the title text
   * to the user's current localization.
   */
  titleLocArgs?: string;
  /**
   * The action associated with a user click on the notification.
   */
  clickAction?: string;
  /**
   * Identifier used to replace existing notifications in the notification drawer.
   * If not specified, each request creates a new notification.
   * If specified and a notification with the same tag is already being shown,
   * the new notification replaces the existing one in the notification drawer.
   */
  tag?: string;
  /**
   * The value of the badge on the home screen app icon.
   * If not specified, the badge is not changed.
   * If set to 0, the badge is removed.
   */
  badge?: string;
  /**
   * This parameter specifies how long (in seconds) the message should be kept in FCM storage if the device is offline.
   * The maximum time to live supported is 4 weeks, and the default value is 4 weeks.
   */
  timeToLive?: number;
  /**
   * Custom data of any shape that will be pushed to the app.
   */
  custom?: any;
  /**
   * Whether or not the notification is a background one. Default is false.
   * The notification will not be viewable by the user, and it is expected to contain a 'custom' field payload
   * that the app may act upon when receiving the background push or SSE notification.
   */
  contentAvailable?: boolean;
  /**
   * Whether or not the notification is a push event only one. Default is false.
   * If this is set true, then the notification will not be sent through the SSE interface.
   */
  pushOnly?: boolean;
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

export const NOTIFICATION_TYPES: NotificationType[] = [
  NotificationType.Donate,
  NotificationType.UpdateDonation,
  NotificationType.RemoveDonation,
  NotificationType.ClaimDonation,
  NotificationType.UnclaimDonation,
  NotificationType.ScheduleDelivery,
  NotificationType.DeliveryStateAdvance,
  NotificationType.DeliveryStateUndo
];
