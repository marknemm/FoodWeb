import { randomBytes } from 'crypto';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import { AccountEntity, PasswordResetEntity } from '~entity';
import { QueryResult } from '~orm';
import { PasswordResetRequest } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { readAccount, readAccounts } from '../account/read-accounts';
import { savePassword } from './save-password';

/**
 * Creates and saves a password reset (token) entry for a specified user.
 * @param usernameEmail The username or email of the user to reset the password of.
 * @return A promise that resolves to the newly created password reset (token) entry.
 * @throws FoodWebError if more than one account is found for a given email, or no accounts are found for either email or username.
 */
export async function savePasswordResetToken(usernameEmail: string): Promise<PasswordResetEntity> {
  const account: AccountEntity = await _findAccount(usernameEmail);
  const passwordResetEntity: PasswordResetEntity = await _findOrGenPasswordResetEntity(account);
  passwordResetEntity.account = account;
  return passwordResetEntity;
}

/**
 * Attempts to find an account via given username or email.
 * @param usernameEmail The username or email to search by.
 * @return A promise that resolves to the found account.
 * @throws FoodWebError if more than one account is found for a given email, or no accounts are found for either email or username.
 */
async function _findAccount(usernameEmail: string): Promise<AccountEntity> {
  // Try to get account via email match.
  const queryResult: QueryResult<AccountEntity> = await readAccounts({ email: usernameEmail, page: 1, limit: 2 }, null);
  if (queryResult.totalCount > 1) {
    throw new FoodWebError('Cannot get a unique account with the given email. Try a username instead.');
  }

  // If email match didn't work, then try to get account via username match.
  const account: AccountEntity = (queryResult.totalCount === 1)
    ? queryResult.entities[0]
    : await readAccount(usernameEmail);
  if (!account) {
    throw new FoodWebError('Account not found. Be sure to enter a valid username.');
  }
  return account;
}

/**
 * Attempts to find an already created password reset entity (such as in case where user resends email).
 * If one cannot be found, then it creates and saves a new one.
 * @param account The account associated with the password reset entity.
 * @return A promise that resolves to the found or generated password reset entity.
 */
async function _findOrGenPasswordResetEntity(account: AccountEntity): Promise<PasswordResetEntity> {
  return getConnection().transaction(async (manager: EntityManager) => {
    // Attempt to load already created password reset entity (user may click 'Resend Email').
    let passwordResetEntity: PasswordResetEntity = await manager.getRepository(PasswordResetEntity).findOne({
      account: { id: account.id }
    });
    // If we cannot load password reset entity, then generate a new one.
    if (!passwordResetEntity) {
      passwordResetEntity = _genPasswordResetEntity(account);
      await manager.getRepository(PasswordResetEntity).save(passwordResetEntity);
    }
    passwordResetEntity.account = account;
    return passwordResetEntity;
  });
}

/**
 * Resets a user's password.
 * @param resetRequest The password reset request containing the reset token and username.
 * @return A promise that resolves when the reset operation is complete.
 * @throws FoodWebError if the password reset failed (due to username - token mismatch or expired/missing token).
 */
export async function resetPassword(resetRequest: PasswordResetRequest): Promise<AccountEntity> {
  const resetToken: string = resetRequest.resetToken;
  const account: AccountEntity = await readAccount(resetRequest.username);
  const passwordResetEntity: PasswordResetEntity = await getRepository(PasswordResetEntity).findOne({
    where: { resetToken, account }
  });

  if (!passwordResetEntity) {
    throw new FoodWebError('Password reset was unsuccessful. Please request another password reset email.');
  }

  await getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(PasswordResetEntity).remove(passwordResetEntity);
    await savePassword(manager, account, resetRequest.password, null, true);
  });

  return account;
}

/**
 * Generates a password reset entity for a given account.
 * @param account The account of the user whose password is to be reset.
 * @return The generated password reset entity.
 */
function _genPasswordResetEntity(account: AccountEntity): PasswordResetEntity {
  const resetToken: string = randomBytes(10).toString('hex'); // Gen 20 char token.
  const passwordResetEntity = new PasswordResetEntity();
  passwordResetEntity.resetToken = resetToken;
  passwordResetEntity.account = account;
  return passwordResetEntity;
}
