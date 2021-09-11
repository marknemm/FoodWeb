import { randomBytes } from 'crypto';
import { Account, ImpersonateTokenResponse } from '~shared';
import { getRedisStore, RedisStore } from '~web/helpers/misc/redis-store';
import { ImpersonateRecord } from '~web/interfaces/impersonate-record';

/**
 * Generates & saves an impersonation token and its associated record.
 * @param targetAccountId The target account of the impersonation request.
 * @param myAccount The account of the admin user that is submitting the impersonation request.
 * @return A promise that resolves to the generated impersonation token.
 */
export async function adminSaveImpersonationToken(targetAccountId: number, myAccount: Account): Promise<ImpersonateTokenResponse> {
  const impersonationToken: string = randomBytes(20).toString('hex');
  const impersonateRecord: ImpersonateRecord = { adminAccountId: myAccount.id, targetAccountId };
  const redisStore: RedisStore = await getRedisStore();
  await redisStore.set(impersonationToken, impersonateRecord);
  return { impersonationToken };
}
