import { getConnection, EntityManager, LessThanOrEqual } from 'typeorm';
import { PasswordResetEntity } from '../entity/password-reset';
import { runJobEveryXMins } from '../helpers/cron';

/**
 * Schedules the deletion of expired password reset tokens to occur every 3 minutes.
 */
export function scheduleExpiredPasswordResetTokDel(): void {
  runJobEveryXMins('Delete Expired Password Reset Tokens', delExpiredPasswordResetToks, 3);
}

/**
 * Deletes all password reset tokens that were created at least 5 minutes ago.
 */
export async function delExpiredPasswordResetToks(): Promise<void> {
  const nowMs = new Date().getTime();
  const tenMinsAgo = new Date(nowMs - 300000);
  await getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(PasswordResetEntity).delete({
      createTimestamp: LessThanOrEqual(tenMinsAgo)
    });
  });
}