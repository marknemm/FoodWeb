import { randomBytes } from 'crypto';
import { AccountEntity } from '~entity';
import { AccountUpdateRequest, AdminAccountCreateRequest } from '~shared';
import { UpdateDiff } from '~web/helpers/misc/update-diff';
import { verifyAccount } from '~web/services/account/account-verification';
import { readFullAccount } from '~web/services/account/read-accounts';
import { createAccount, NewAccountData, updateAccount } from '~web/services/account/save-account';
export { NewAccountData };

/**
 * Creates a new account based off of a given account create request.
 * @param createReq The account create request.
 * @return A promise that resolves to the newly created account data (account & verification data).
 */
export async function adminCreateAccount(createReq: AdminAccountCreateRequest): Promise<NewAccountData> {
  createReq.password = autoGenPasswordIfConfig(createReq);
  const newAccountData: NewAccountData = await createAccount(createReq);
  newAccountData.account = await autoVerifyAccountIfConfig(createReq, newAccountData);
  return newAccountData;
}

/**
 * Auto generates a random password for a new account that is to be created if a given account create request dictates it.
 * @param createReq The account create request.
 * @return The password string for the new account. Will be a randomly generated one if the account create request dictates it.
 * Otherwise, will be the user input password string sent via the account create request.
 */
function autoGenPasswordIfConfig(createReq: AdminAccountCreateRequest): string {
  return (createReq.accountCreateOptions.autoGenPassword)
    ? randomBytes(8).toString('hex')
    : createReq.password;
}

/**
 * Auto verifies a newly saved account if a given account create request dictates it.
 * @param createReq The account create request.
 * @param newAccountData The data for the newly saved account that may be auto verified.
 * @return A promsie that resolves to the newly saved account that is verified if the account create request dictates it.
 */
async function autoVerifyAccountIfConfig(createReq: AdminAccountCreateRequest, newAccountData: NewAccountData): Promise<AccountEntity> {
  return (createReq.accountCreateOptions?.autoVerify)
    ? verifyAccount(newAccountData.account, { verificationToken: newAccountData.unverifiedAccount.verificationToken })
    : newAccountData.account;
}

/**
 * Updates an account based off of a given account ID and update request.
 * @param accountId The ID of the account that is to be updated.
 * @param updateReq The account update request.
 * @return A promsie that resolves to the account update diff.
 */
export async function adminUpdateAccount(accountId: number, updateReq: AccountUpdateRequest): Promise<UpdateDiff<AccountEntity>> {
  const origAccount: AccountEntity = await readFullAccount(accountId);
  return updateAccount(updateReq, origAccount);
}
