import { FindConditions, getRepository, In, LessThanOrEqual, MoreThan } from 'typeorm';
import { AccountEntity, NotificationEntity } from '~entity';
import { genSkip, genTake } from '~orm';
import { Account, NotificationReadRequest, NotificationType } from '~shared';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

/**
 * Reads notifications from the database.
 * @param request The notifications request used to perform filtering and paging on notifications to retrieve.
 * @param myAccount The account of the current user.
 * @return A promise that resolves to the notifications query result.
 */
export async function readNotifications(request: NotificationReadRequest, myAccount: AccountEntity): ListResponsePromise<NotificationEntity> {
  const [notifications, totalCount]: [NotificationEntity[], number] = await getRepository(NotificationEntity).findAndCount({
    where: _genFindConditions(request, myAccount),
    skip: genSkip(request),
    take: genTake(request, 10),
    order: { flagged: 'DESC', id: 'DESC' } // Get flagged & latest notifications first.
  });
  return genListResponse(notifications, totalCount, request);
}

/**
 * Generates the find conditions for reading notifications.
 * @param request The notification read request containing the query filters.
 * @param myAccount The account of the user to fetch the notifications for.
 * @return The generated find conditions.
 */
function _genFindConditions(request: NotificationReadRequest, myAccount: AccountEntity): FindConditions<NotificationEntity> {
  const conditions: FindConditions<NotificationEntity> = {};
  conditions.account = myAccount;
  if (request.id != null) {
    conditions.id = request.id;
  }
  if (request.maxId != null) {
    conditions.id = LessThanOrEqual(request.id);
  }
  if (request.flagged != null) {
    conditions.flagged = request.flagged;
  }
  if (request.read != null) {
    conditions.read = request.read;
  }
  if (request.unseen && request.id == null) {
    conditions.id = MoreThan(myAccount.lastSeenNotificationId);
  }
  if (request.latestTimestamp != null) {
    conditions.timestamp = LessThanOrEqual(request.latestTimestamp);
  }
  if (request.notificationType != null) {
    // notificationType query param can either be a single NotificationType or comma separated list.
    conditions.notificationType = (request.notificationType && (<string>request.notificationType).indexOf(',') >= 0)
      ? In(<NotificationType[]><unknown>(<string>request.notificationType).split(','))
      : <NotificationType>request.notificationType;
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
