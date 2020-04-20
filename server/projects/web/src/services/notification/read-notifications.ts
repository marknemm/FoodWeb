import { FindConditions, getRepository, In, MoreThan } from 'typeorm';
import { AccountEntity, NotificationEntity } from '~entity';
import { QueryResult } from '~orm';
import { Account, NotificationReadFilters, NotificationReadRequest, NotificationType } from '~shared';

/**
 * Reads notifications from the database.
 * @param request The notifications request used to perform filtering and paging on notifications to retrieve.
 * @param myAccount The account of the current user.
 * @return A promise that resolves to the notifications query result.
 */
export async function readNotifications(request: NotificationReadRequest, myAccount: AccountEntity): Promise<QueryResult<NotificationEntity>> {
  const [notifications, totalCount]: [NotificationEntity[], number] = await getRepository(NotificationEntity).findAndCount({
    where: _genFindConditions(request, myAccount),
    skip: request.page && request.limit ? (request.page - 1) * request.limit : 0,
    take: request.limit ? request.limit : 10,
    order: { flagged: 'DESC', id: 'DESC' } // Get flagged & latest notifications first.
  });
  return { entities: notifications, totalCount };
}

/**
 * Generates the find conditions for reading notifications.
 * @param request The notification read request containing the query filters.
 * @param myAccount The account of the user to fetch the notifications for.
 * @return The generated find conditions.
 */
function _genFindConditions(filters: NotificationReadFilters, myAccount: AccountEntity): FindConditions<NotificationEntity> {
  const conditions: FindConditions<NotificationEntity> = {};
  conditions.account = myAccount;
  if (filters.id != null) {
    conditions.id = filters.id;
  }
  if (filters.flagged != null) {
    conditions.flagged = filters.flagged;
  }
  if (filters.read != null) {
    conditions.read = filters.read;
  }
  if (filters.unseen && filters.id == null) {
    conditions.id = MoreThan(myAccount.lastSeenNotificationId);
  }
  if (filters.notificationType != null) {
    // notificationType query param can either be a single NotificationType or comma separated list.
    conditions.notificationType = (filters.notificationType && (<string>filters.notificationType).indexOf(',') >= 0)
      ? In((<string>filters.notificationType).split(','))
      : <NotificationType>filters.notificationType;
  }
  return conditions;
}

/**
 * Reads the count of unseen notifications for a given account.
 * @param account The account to read the count of unseen notifications for.
 * @return A promise that resolves to the number of unseen notifications.
 */
export async function readUnseenNotificationsCount(account: Account): Promise<number> {
  return await getRepository(NotificationEntity).count({
    where: {
      id: MoreThan(account.lastSeenNotificationId),
      account
    }
  });
}
