import { randomBytes } from 'crypto';
import { AccountEntity } from '~entity';
import { AccountCreateRequest, AccountSectionUpdateReqeust, AccountUpdateRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { verifyAccount } from '~web/services/account/account-verification';
import { readFullAccount } from '~web/services/account/read-accounts';
import { createAccount, NewAccountData, updateAccount, updateAccountSection } from '~web/services/account/save-account';
export { NewAccountData };

export async function adminCreateAccount(createReq: AccountCreateRequest): Promise<NewAccountData> {
  createReq.password = autoGenPasswordIfConfig(createReq);
  const newAccountData: NewAccountData = await createAccount(createReq);
  newAccountData.account = await autoVerifyAccountIfConfig(createReq, newAccountData);
  return newAccountData;
}

function autoGenPasswordIfConfig(createReq: AccountCreateRequest): string {
  return (createReq.accountCreateOptions.autoGenPassword)
    ? randomBytes(8).toString('hex')
    : createReq.password;
}

async function autoVerifyAccountIfConfig(createReq: AccountCreateRequest, newAccountData: NewAccountData): Promise<AccountEntity> {
  return (createReq.accountCreateOptions?.autoVerify)
    ? verifyAccount(newAccountData.account, { verificationToken: newAccountData.unverifiedAccount.verificationToken })
    : newAccountData.account;
}

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
