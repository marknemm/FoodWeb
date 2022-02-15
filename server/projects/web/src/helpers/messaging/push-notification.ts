import { MobileDevice, Notification } from '~entity';
import { toExternalUrl } from '~web/helpers/misc/url';
import { firebase, Message, Messaging, MulticastMessage } from './firebase';

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
  private readonly _firebaseMessaging: Messaging = firebase.messaging();

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
    if (pushRegistrationIds?.length) {
      const notificationMessage: MulticastMessage = this._genMulticastMessage(notification, pushRegistrationIds);
      await this._firebaseMessaging.sendMulticast(notificationMessage)
        .then((responseContainer) => {
          for (const response of responseContainer.responses) {
            if (response.error) {
              console.error('Error when broadcasting push notifications:', response.error.toJSON());
            }
          }
        })
        .catch(console.error);
    }
  }

  /**
   * Sends a push notification to a single target device.
   * @param pushTarget The target device.
   * @param notification The notification that is to be sent.
   * @return A promise that resolves once the push notification has been sent.
   */
  async sendPushNotification(pushTarget: MobileDevice, notification: Notification): Promise<void> {
    const pushRegistrationIds: string[] = this._pushTargetsToPushRegistrationIds([pushTarget]);
    if (pushRegistrationIds?.length) {
      const notificationMessage: Message = this._genMessage(notification, pushRegistrationIds[0]);
      await this._firebaseMessaging.send(notificationMessage).catch(console.error);
    }
  }

  /**
   * Converts a list of push notification targets to a list of push notification registration IDs.
   * @param pushTargets A list of the push notification targets.
   * @return The list of push notification registration IDs.
   */
  private _pushTargetsToPushRegistrationIds(pushTargets: MobileDevice[]): string[] {
    return pushTargets.map((pushTarget: MobileDevice) => pushTarget.pushRegistrationId).filter((id: string) => !!id);
  }

  /**
   * Generates a FCM multicast push notification message based off of a `Notification` entity.
   * @param notification The notification entity form which to generate the message.
   * @param pushRegistrationIds The Push Notification registration IDs associated with target users' mobile devices.
   * @return The generated multicast push notification message.
   */
  private _genMulticastMessage(notification: Notification, pushRegistrationIds: string[]): MulticastMessage {
    const message: MulticastMessage = { tokens: pushRegistrationIds };
    this._fillMessageBase(message, notification);
    return message;
  }

  private _genMessage(notification: Notification, pushRegistrationId: string): Message {
    const message: Message = { token: pushRegistrationId };
    this._fillMessageBase(message, notification);
    return message;
  }

  private _fillMessageBase(message: Message | MulticastMessage, notification: Notification): void {
    message.data = {
      title: notification.title ?? '',
      subtitle: notification.subtitle ?? '',
      body: notification.body ?? '',
      color: notification.color ?? '',
      image: toExternalUrl(notification.image) ?? '',
      sound: notification.sound ?? '',
      body_loc_key: notification.locKey ?? '',
      body_loc_args: notification.locArgs ?? '',
      title_loc_key: notification.titleLocKey ?? '',
      title_loc_args: notification.titleLocArgs ?? '',
      click_action: notification.clickAction ?? '',
      tag: notification.tag ?? '',
      badge: notification.badge ?? '',
      notificationLink: notification.notificationLink ?? ''
    };

    message.notification = {};
    message.android = {};
    message.apns = {};

    if (notification.title) {
      message.notification.title = notification.title.replace(/(<([^>]+)>)/gi, '').trim();
    }

    if (notification.body) {
      message.notification.body = notification.body.replace(/(<([^>]+)>)/gi, '').replace(/\s+/gi, ' ').trim();
    }

    if (notification.priority) {
      message.android.priority = notification.priority;
    }

    if (notification.timeToLive) {
      message.android.ttl = notification.timeToLive;
    }
  }

}

/**
 * Generates/gets a singleton instance of the PushNotificationClient.
 * @return The PushNotificationClient.
 */
export function getPushNotificationClient(): PushNotificationClient {
  return PushNotificationClient.getInstance();
}
