import { Message, Sender } from 'node-gcm';
import { MobileDevice, Notification } from '~entity';
import { toExternalUrl } from '~web/helpers/misc/url';
import { env } from '../globals/env';

/**
 * A push notification client that is used to send (mobile app) push notifications via Google Cloud Messaging (GCM).
 */
export class PushNotificationClient {

  /**
   * The singleton instance of this PushNotificationClient.
   */
  private static _instance: PushNotificationClient;

  /**
   * A Google Cloud Messaging (GCM) Sender.
   */
  private readonly _gcmSender = new Sender(env.FCM_SERVER_KEY);

  /**
   * Private constructor to enforce singleton instance.
   */
  private constructor() {}

  /**
   * Generates/gets a singleton instance of the PushNotificationClient.
   * @return The PushNotificationClient.
   */
  static getInstance(): PushNotificationClient {
    if (!PushNotificationClient._instance) {
      PushNotificationClient._instance = new PushNotificationClient();
    }
    return PushNotificationClient._instance;
  }

  /**
   * Broadcasts a push notification to a set of given target devices.
   * @param pushTargets The target devices.
   * @param notification The notification that is to be sent.
   * @return A promise that resolves to th e list of push notification results.
   */
  async broadcastPushNotifications(pushTargets: MobileDevice[], notification: Notification): Promise<void> {
    const pushRegistrationIds: string[] = this._pushTargetsToPushRegistrationIds(pushTargets);
    const notificationMessage: Message = this._genNotificationMessage(notification);
    this._gcmSender.send(notificationMessage, pushRegistrationIds, () => {});
  }

  /**
   * Sends a push notification to a single target device.
   * @param pushTarget The target device.
   * @param notification The notification that is to be sent.
   * @return A promise that resolves to the push notification result.
   */
  async sendPushNotification(pushTarget: MobileDevice, notification: Notification): Promise<void> {
    const pushRegistrationIds: string[] = this._pushTargetsToPushRegistrationIds([pushTarget]);
    const notificationMessage: Message = this._genNotificationMessage(notification);
    this._gcmSender.send(notificationMessage, pushRegistrationIds, () => {});
  }

  /**
   * Converts a list of push notification targets to a list of push notification registration IDs.
   * @param pushTargets A list of the push notification targets.
   * @return The list of push notification registration IDs.
   */
  private _pushTargetsToPushRegistrationIds(pushTargets: MobileDevice[]): string[] {
    return pushTargets.map((pushTarget: MobileDevice) => pushTarget.pushRegistrationId);
  }

  /**
   * Wraps a notification inside a message.
   * @param notification The notification.
   * @return The notification message.
   */
  private _genNotificationMessage(notification: Notification): Message {
    return new Message({
      priority: notification.priority,
      timeToLive: notification.timeToLive,
      contentAvailable: notification.contentAvailable,
      data: {
        title: notification.title,
        subtitle: notification.subtitle,
        body: notification.body,
        color: notification.color,
        image: toExternalUrl(notification.image),
        sound: notification.sound,
        body_loc_key: notification.locKey,
        body_loc_args: notification.locArgs,
        title_loc_key: notification.titleLocKey,
        title_loc_args: notification.titleLocArgs,
        click_aciton: notification.clickAction,
        tag: notification.tag,
        badge: notification.badge,
        notificationLink: notification.notificationLink
      }
    });
  }

}

/**
 * Generates/gets a singleton instance of the PushNotificationClient.
 * @return The PushNotificationClient.
 */
export function getPushNotificationClient(): PushNotificationClient {
  return PushNotificationClient.getInstance();
}
