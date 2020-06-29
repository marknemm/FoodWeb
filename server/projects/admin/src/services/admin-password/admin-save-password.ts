import { AccountEntity } from '~entity';
import { OrmEntityManager } from '~orm';
import { PasswordUpdateRequest } from '~shared';
import { readFullAccount } from '~web/services/account/read-accounts';
import { savePassword } from '~web/services/password/save-password';

/**
 * Updates an account's password based off of a given update request and account ID.
 * NOTE: This update operation does not require the original/current password.
 * @param updateReq The password update request.
 * @param accountId The ID of the associated account.
 * @return A promise that resolves once the operation completes.
 */
export async function adminUpdatePassword(updateReq: PasswordUpdateRequest, accountId: number): Promise<void> {
  const password = updateReq.password;
  const targetAccount: AccountEntity = await readFullAccount(accountId);
  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    // Input true for isReset so we don't need current/old password check.
    await savePassword(manager, targetAccount, password, null, true);
  });
}
