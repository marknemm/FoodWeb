import { getConnection, EntityManager } from 'typeorm';
import { NotificationEntity } from '../entity/notification.entity';
import { Notification } from '../../../shared/src/interfaces/notification/notification';

export async function saveAndPushNotification(notification: Notification) {
  await saveNotification(notification);
}

export async function saveNotification(notification: Notification): Promise<NotificationEntity> {
  return await getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(NotificationEntity).save(notification);
  });
}
