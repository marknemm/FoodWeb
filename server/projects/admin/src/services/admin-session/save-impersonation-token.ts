import { randomBytes } from 'crypto';
import { Account, ImpersonateTokenResponse } from '~shared';
import { RedisStore } from '~web/helpers/misc/redis-store';
import { ImpersonateRecord } from '~web/interfaces/impersonate-record';

/**
 * Generates & saves an impersonation token and its associated record.
 * @param targetAccountId The target account of the impersonation request.
 * @param myAccount The account of the admin user that is submitting the impersonation request.
 * @return A promsie that resolves to the generated impersonation token.
 */
export async function saveImpersonationToken(targetAccountId: number, myAccount: Account): Promise<ImpersonateTokenResponse> {
  const impersonationToken: string = randomBytes(20).toString('hex');
  const impersonateRecord: ImpersonateRecord = { adminAccountId: myAccount.id, targetAccountId };
  await RedisStore.getStore().set(impersonationToken, impersonateRecord);
  return { impersonationToken };
}
