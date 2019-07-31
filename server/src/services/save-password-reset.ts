import { EntityManager, getRepository, getConnection } from 'typeorm';
import { randomBytes } from 'crypto';
import { readAccount } from './read-accounts';
import { savePassword } from './save-password';
import { saveAudit, AuditEventType } from './save-audit';
import { AccountEntity } from '../entity/account.entity';
import { PasswordResetEntity } from '../entity/password-reset';
import { FoodWebError } from '../helpers/food-web-error';
import { PasswordResetRequest } from '../../../shared/src/interfaces/account/password-reset-request';

/**
 * Creates and saves a password reset (token) entry for a specified user.
 * @param username The username of the user to reset the password of.
 * @return A promise that resolves to the newly created password reset (token) entry.
 * @throws FoodWebError if the given username cannot be found.
 */
export async function savePasswordResetToken(username: string): Promise<PasswordResetEntity> {
  return getConnection().transaction(async (manager: EntityManager) => {
    const account: AccountEntity = (await readAccount(username));
    if (!account) {
      throw new FoodWebError('Account not found. Be sure to enter a valid username.');
    }
    // Attempt to load already created password reset entity (user may click 'Resend Email').
    let passwordResetEntity: PasswordResetEntity = await manager.getRepository(PasswordResetEntity).findOne({ 
      account: { id: account.id }
    });
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
 * @return A promise that resolves to the account of the user whose password was reset.
 * @throws FoodWebError if the password reset failed (due to username - token mismatch or expired/missing token).
 */
export async function resetPassword(resetRequest: PasswordResetRequest): Promise<AccountEntity> {
  const resetToken: string = resetRequest.resetToken;
  const account: AccountEntity = await getRepository(AccountEntity).findOne({
    relations: ['contactInfo', 'organization', 'operationHours'],
    where: { username: resetRequest.username }
  });
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

  saveAudit(AuditEventType.ResetPassword, account, 'xxxxxx', 'xxxxxx', resetRequest.recaptchaScore);
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
