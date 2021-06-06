import { plainToClass } from 'class-transformer';
import { getConnection } from 'typeorm';
import { AccountEntity, NotificationEntity } from '~entity';
import { getOrmRepository, OrmEntityManager } from '~orm';
import { Notification } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { FoodWebError } from '~web/helpers/response/foodweb-error';

/**
 * Creates a NotificationEntity and saves it in the database.
 * @param notification The notification template to create the NotificationEntity from.
 * @param account The account that the notification is for.
 * @return A promise that resolves to the created and saved NotificationEntity.
 */
export function createNotification(notification: Notification, account: AccountEntity): Promise<NotificationEntity> {
  const newNotification: NotificationEntity = plainToClass(NotificationEntity, notification);
  newNotification.account = account;
  return OrmEntityManager.transaction((manager: OrmEntityManager) => {
    return manager.getRepository(NotificationEntity).save(newNotification);
  });
}

/**
 * Updates the seen notifications indicator for a given account.
 * @param myAccount The account to update the seen notifications for.
 * @param lastSeenNotificationId The ID of the notification that has been last seen by the account user.
 * @return A promise that resolves to the lastSeenNotificationId when complete.
 */
export async function updateSeenNotifications(myAccount: AccountEntity, lastSeenNotificationId: number): Promise<number> {
  await getConnection().createQueryBuilder()
    .update(AccountEntity)
    .set({ lastSeenNotificationId })
    .where('id = :id', { id: myAccount.id })
    .execute();
  return lastSeenNotificationId;
}

/**
 * Updates a given notification. Will only update metadata related to the notification (not the actual content).
 * @param myAccount The account of the current user that is requesting the notification update.
 * @param notificationUpdt The notification update.
 * @return A promise that resolves to the update diff for the notification on success.
 * @throws FoodWebError if the current user is not authorized to perform the notification update.
 */
export async function updateNotification(
  myAccount: AccountEntity,
  notificationUpdt: Notification
): Promise<UpdateDiff<NotificationEntity>> {
  const oldNotification: NotificationEntity = await getOrmRepository<NotificationEntity>(NotificationEntity).findOne({
    relations: ['account'],
    where: { id: notificationUpdt.id }
  });
  _ensureCanUpdateNotification(oldNotification, myAccount);
  const notificationToSave: NotificationEntity = Object.assign(new NotificationEntity(), oldNotification); // Shallow copy.
  notificationToSave.read = notificationUpdt.read;
  notificationToSave.flagged = notificationUpdt.flagged;
  const newNotification: NotificationEntity = await OrmEntityManager.transaction((manager: OrmEntityManager) => {
    return manager.getRepository(NotificationEntity).save(notificationToSave);
  });
  return { old: oldNotification, new: newNotification };
}

/**
 * Ensures that the current user can update a given notification.
 * @param notification The notification to check the user's update privileges for.
 * @param myAccount The account of the current user.
 * @throws FoodWebError if the current user is not authorized to update the given notification.
 */
function _ensureCanUpdateNotification(notification: NotificationEntity, myAccount: AccountEntity): void {
  if (!notification.account || notification.account.id !== myAccount.id) {
    throw new FoodWebError(`Update failed: Cannot update a notification that does not belong to you`);
  }
}
