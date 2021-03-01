import { AccountEntity, AppDataEntity, Notification, NotificationEntity, NotificationType } from '~entity';
import { ServerSentEventType } from '~shared';
import { getPushNotificationClient, PushNotificationClient } from '~web/helpers/messaging/push-notification';
import { getSSEClient, SSE, SSEClient } from '~web/helpers/messaging/sse';
import { readAppData } from '~web/services/app-data/read-app-data';
import { readUnseenNotificationsCount } from '~web/services/notification/read-notifications';
import { createNotification } from '~web/services/notification/save-notification';
export { Notification, NotificationType };

/**
 * A notification client that is used to send various types of notifications (e.g. server-sent-event, push).
 */
export class NotificationClient {

  /**
   * The singleton instance of this NotificationClient.
   */
  private static _instance: NotificationClient;

  /**
   * Private constructor to enforce singleton instance.
   */
  private constructor() {}

  /**
   * Generates/gets a singleton instance of the NotificationClient.
   * @return The NotificationClient.
   */
  static getInstance(): NotificationClient {
    if (!NotificationClient._instance) {
      NotificationClient._instance = new NotificationClient();
    }
    return NotificationClient._instance;
  }

  /**
   * Broadcasts a given notification to a given list of accounts (via Push and/or SSE).
   * Also, saves the broadcasted notifications for later lookup within the app/website.
   * @param accounts The accounts to broadcast the notification to.
   * @param notification The notification that is to be broadcasted.
   * @return A promise that resolves to the saved notification entities of broadcasted notifications.
   */
  async broadcastNotification(accounts: AccountEntity[], notification: Notification): Promise<NotificationEntity[]> {
    // Only send push notifications to accounts that have it enabled.
    const pushClient: PushNotificationClient = getPushNotificationClient();
    const pushAccounts: AccountEntity[] = accounts.filter((account: AccountEntity) => account.contactInfo.enablePushNotification);
    const pushTargets: AppDataEntity[] = await this._getPushTargets(pushAccounts);
    await pushClient.broadcastPushNotifications(pushTargets, notification);
    // Send Server Sent Event notifications to all accounts (will show up within in-app/website notifications menu).
    return (!notification.pushOnly)
      ? Promise.all(accounts.map((account: AccountEntity) => this._sendSSE(account, notification)))
      : [];
  }

  /**
   * Sends a given notification to a given account (via Push and/or SSE).
   * Also, saves the sent notification for later lookup within the app/website.
   * @param account The account to send the notification to.
   * @param notification The notification that is to be sent.
   * @return A promise that resolves to the saved notification entity of the sent notification.
   */
  async sendNotification(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
    // If the user has disabled push notifications, then do not send.
    const pushClient: PushNotificationClient = getPushNotificationClient();
    if (!account.contactInfo.enablePushNotification) {
      const pushTargets: AppDataEntity[] = await this._getPushTargets(account);
      await pushClient.broadcastPushNotifications(pushTargets, notification);
    }
    // Send Server Sent Event notification (will show up within in-app/website notifications menu).
    return (!notification.pushOnly)
      ? this._sendSSE(account, notification)
      : null;
  }

  /**
   * Gets the app data targets of a push notification.
   * @param accounts The accounts that are to be targeted by push notification.
   * @return A promise that resolves to the app data targets.
   */
  private async _getPushTargets(accounts: AccountEntity[] | AccountEntity): Promise<AppDataEntity[]> {
    accounts = (accounts instanceof Array) ? accounts : [accounts];
    const accountIds: number[] = accounts.map((account: AccountEntity) => account.id);
    return (await readAppData({ accountIds, page: 1, limit: 1000 })).list;
  }

  /**
   * Sends a notification via Server-Sent Event (SSE) to a given account.
   * @param account The account to send the SSE to.
   * @param notification The notification to send (via SSE).
   * @return A promise that resolves to the saved entity of the sent notification.
   */
  private async _sendSSE(account: AccountEntity, notification: Notification): Promise<NotificationEntity> {
    const sseClient: SSEClient = getSSEClient();
    const savedNotification: NotificationEntity = await createNotification(notification, account);
    const unseenNotificationsCount: number = await readUnseenNotificationsCount(account);
    const sse: SSE = {
      id: ServerSentEventType.NotificationsAvailable,
      data: { unseenNotificationsCount }
    };
    sseClient.sendEvent(account, sse);
    return savedNotification;
  }
}

/**
 * Generates/gets a singleton instance of the NotificationClient.
 * @return The NotificationClient.
 */
export function getNotificationClient(): NotificationClient {
  return NotificationClient.getInstance();
}
