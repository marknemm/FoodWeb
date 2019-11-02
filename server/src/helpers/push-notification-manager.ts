import 'dotenv';
import PushNotifications = require('node-pushnotifications');
import { AppData, AppDataEntity } from '../entity/app-data.entity';
import { NotificationEntity } from '../entity/notification.entity';

export type PushTarget = AppData | PushNotifications.RegistrationId;

const _pushNotificationClient: PushNotifications = _initPushNotificationClient();

/**
 * Initializes the push notification client.
 * @return The initialized push notification client.
 */
function _initPushNotificationClient(): PushNotifications {
  const settings: PushNotifications.Settings = {
    gcm: {
        id: process.env.FCM_SERVER_KEY
    },
    isAlwaysUseFCM: false, // true all messages will be sent through node-gcm (which actually uses FCM)
  };
  settings.gcm['phonegap'] = true; // Turn on cordova/phonegap compatibility mode.
  return new PushNotifications(settings);
}

/**
 * Broadcasts a push notification to a set of given target devices.
 * @param pushTargets The target devices.
 * @param notification The notification that is to be sent.
 * @return A promise that resolves to th e list of push notification results.
 */
export async function broadcastPushNotifications(
  pushTargets: PushTarget[],
  notification: NotificationEntity
): Promise<PushNotifications.Result[]> {
  const registrationIds: PushNotifications.RegistrationId[] = _pushTargetsToRegistrationIds(pushTargets);
  const pushData: PushNotifications.Data = _notificationToPushData(notification);
  return _pushNotificationClient.send(registrationIds, pushData);
}

/**
 * Sends a push notification to a single target device.
 * @param pushTarget The target device.
 * @param notification The notification that is to be sent.
 * @return A promise that resolves to the push notification result.
 */
export async function sendPushNotification(
  pushTarget: PushTarget,
  notification: NotificationEntity
): Promise<PushNotifications.Result> {
  const registrationId: PushNotifications.RegistrationId = _pushTargetToRegistrationId(pushTarget);
  const pushData: PushNotifications.Data = _notificationToPushData(notification);
  return (await _pushNotificationClient.send(registrationId, pushData))[0];
}

/**
 * Converts a list of push notification targets to a list of push notification registration IDs.
 * @param pushTargets A list of the push notification targets.
 * @return The list of push notification registration IDs.
 */
function _pushTargetsToRegistrationIds(pushTargets: PushTarget[]): PushNotifications.RegistrationId[] {
  return pushTargets.map((pushTarget: PushTarget) => _pushTargetToRegistrationId(pushTarget));
}

/**
 * Converts a push notification target to a push notification registration ID.
 * @param pushTarget The push notification target.
 * @return The push notification registration ID.
 */
function _pushTargetToRegistrationId(pushTarget: PushTarget): PushNotifications.RegistrationId {
  return (pushTarget instanceof AppDataEntity)
    ? pushTarget.pushRegistrationId
    : <PushNotifications.RegistrationId>pushTarget;
}

function _notificationToPushData(notification: NotificationEntity): PushNotifications.Data {
  return {
    title: notification.notificationTitle,
    body: notification.notificationBody
  };
}
