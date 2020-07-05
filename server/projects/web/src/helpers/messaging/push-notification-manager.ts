import 'dotenv';
import { Message, Sender } from 'node-gcm';
import { AppData, Notification } from '~entity';
import { toExternalUrl } from '../misc/resource-resolver';

const _pushNotificationClient = new Sender(process.env.FCM_SERVER_KEY);

/**
 * Broadcasts a push notification to a set of given target devices.
 * @param pushTargets The target devices.
 * @param notification The notification that is to be sent.
 * @return A promise that resolves to th e list of push notification results.
 */
export async function broadcastPushNotifications(pushTargets: AppData[], notification: Notification): Promise<void> {
  const pushRegistrationIds: string[] = _pushTargetsToPushRegistrationIds(pushTargets);
  const notificationMessage: Message = _genNotificationMessage(notification);
  _pushNotificationClient.send(notificationMessage, pushRegistrationIds, () => {});
}

/**
 * Sends a push notification to a single target device.
 * @param pushTarget The target device.
 * @param notification The notification that is to be sent.
 * @return A promise that resolves to the push notification result.
 */
export async function sendPushNotification(pushTarget: AppData, notification: Notification): Promise<void> {
  const pushRegistrationIds: string[] = _pushTargetsToPushRegistrationIds([pushTarget]);
  const notificationMessage: Message = _genNotificationMessage(notification);
  _pushNotificationClient.send(notificationMessage, pushRegistrationIds, () => {});
}

/**
 * Converts a list of push notification targets to a list of push notification registration IDs.
 * @param pushTargets A list of the push notification targets.
 * @return The list of push notification registration IDs.
 */
function _pushTargetsToPushRegistrationIds(pushTargets: AppData[]): string[] {
  return pushTargets.map((pushTarget: AppData) => pushTarget.pushRegistrationId);
}

/**
 * Wraps a notification inside a message.
 * @param notification The notification.
 * @return The notification message.
 */
function _genNotificationMessage(notification: Notification): Message {
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
