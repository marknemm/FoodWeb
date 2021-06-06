import { EntityManager, getConnection, LessThanOrEqual } from 'typeorm';
import { PasswordResetEntity } from '~entity';

/**
 * Deletes password reset (token) entries that are older than 5 minutes.
 * @return A promise that resolves once the operation completes.
 */
export default async function deletePasswordReset(): Promise<void> {
  const nowMs = new Date().getTime();
  const fiveMinsAgo = new Date(nowMs - 300000);
  await getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(PasswordResetEntity).delete({
      createTimestamp: LessThanOrEqual(fiveMinsAgo)
    });
  });
}
