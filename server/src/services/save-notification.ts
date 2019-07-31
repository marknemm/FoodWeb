import { getConnection, EntityManager } from 'typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { AccountEntity } from '../entity/account.entity';
import { Notification } from '../../../shared/src/interfaces/notification/notification';

export async function saveAndPushNotification(notification: Notification) {
  await saveNotification(notification);
}

export async function saveNotification(notification: Notification): Promise<NotificationEntity> {
  return await getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(NotificationEntity).save(notification);
  });
}

/**
 * Updates the seen notifications indicator for a given account.
 * @param myAccount The account to update the seen notifications for.
 * @param lastSeenNotificationId The ID of the notification that has been last seen by the account user.
 * @return A promise that resolves to the lastSeenNotificationId when complete.
 */
export async function updateSeenNotifications(myAccount: Account, lastSeenNotificationId: number): Promise<number> {
  await getConnection().createQueryBuilder()
    .update(AccountEntity)
    .set({ lastSeenNotificationId })
    .where('id = :id', { id: myAccount.id })
    .execute();
  return lastSeenNotificationId;
}
