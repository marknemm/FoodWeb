import { AccountEntity } from '~entity';
import { AccountSectionUpdateReqeust, AccountUpdateRequest } from '~shared';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { readFullAccount } from '~web/services/account/read-accounts';
import { updateAccount, updateAccountSection } from '~web/services/account/save-account';

export async function adminUpdateAccount(accountId: number, updateReq: AccountUpdateRequest): Promise<UpdateDiff<AccountEntity>> {
  const origAccount: AccountEntity = await readFullAccount(accountId);
  return updateAccount(updateReq, origAccount);
}

export async function adminUpdateAccountSection(
  accountId: number,
  updateReq: AccountSectionUpdateReqeust
): Promise<UpdateDiff<AccountEntity>> {
  const origAccount: AccountEntity = await readFullAccount(accountId);
  return updateAccountSection(updateReq, origAccount);
}
