import { getRepository, FindConditions, In } from 'typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { Account } from '../../../shared/src/interfaces/account/account';
import { Notification, NotificationType } from '../../../shared/src/interfaces/notification/notification';
import { NotificationReadRequest } from '../../../shared/src/interfaces/notification/notification-read-request';

/**
 * The result of a query for notifications.
 * Contains the retrieved notifications & the total count of all notifications available for the user.
 */
export interface NotificationsQueryResult {
  notifications: Notification[];
  totalCount: number;
}

/**
 * Reads notifications from the database.
 * @param request The notifications request used to perform filtering and paging on notifications to retrieve.
 * @param myAccount The account of the current user.
 * @return A promise that resolves to the notifications query result.
 */
export async function readNotifications(request: NotificationReadRequest, myAccount: Account): Promise<NotificationsQueryResult> {
  const [notifications, totalCount]: [NotificationEntity[], number] = await getRepository(NotificationEntity).findAndCount({
    where: _genFindConditions(request, myAccount),
    skip: (request.page - 1) * request.limit,
    take: request.limit,
    order: { id: 'DESC' } // Get latest notifications first.
  });
  return { notifications, totalCount };
}

/**
 * Generates the find conditions for reading notifications.
 * @param request The notification read request containing the query filters.
 * @param myAccount The account of the user to fetch the notifications for.
 * @return The generated find conditions.
 */
function _genFindConditions(request: NotificationReadRequest, myAccount: Account): FindConditions<NotificationEntity> {
  const conditions: FindConditions<NotificationEntity> = {};
  conditions.account = myAccount;
  conditions.id = request.id;
  // notificationType query param can either be a single NotificationType or comma separated list.
  conditions.notificationType = (request.notificationType && (<string>request.notificationType).indexOf(',') >= 0)
    ? In((<string>request.notificationType).split(','))
    : <NotificationType>request.notificationType;
  return conditions;
}
