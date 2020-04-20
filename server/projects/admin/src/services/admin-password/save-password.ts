import { AccountEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { PasswordUpdateRequest } from '~shared';
import { readFullAccount } from '~web/services/account/read-accounts';
import { savePassword } from '~web/services/password/save-password';

export async function adminUpdatePassword(updateReq: PasswordUpdateRequest, accountId: number): Promise<void> {
  const password = updateReq.password;
  const targetAccount: AccountEntity = await readFullAccount(accountId);
  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    // Input true for isReset so we don't need current/old password check.
    await savePassword(manager, targetAccount, password, null, true);
  });
}
