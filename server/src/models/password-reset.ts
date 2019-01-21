import { EntityManager, getRepository, Repository, getConnection } from 'typeorm';
import { randomBytes } from 'crypto';
import { AccountEntity } from '../entity/account.entity';
import { MailTransporter, sendEmail } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { PasswordResetEntity } from '../entity/password-reset';
import { getAccounts } from './get-account';
import { savePassword } from './save-account';

export async function savePasswordResetToken(username: string): Promise<void> {
  await getConnection().transaction(async (manager: EntityManager) => {
    const account: AccountEntity = (await getAccounts({ username }, 1, 1))[0];
    if (!account) {
      throw new FoodWebError('Account not found. Be sure to enter a valid username.');
    }
    // Attempt to load already created password reset entity (user may click 'Resend Email').
    let passwordResetEntity: PasswordResetEntity = await manager.getRepository(PasswordResetEntity).findOne({ account });
    if (!passwordResetEntity) {
      passwordResetEntity = _genPasswordResetEntity(account);
      await manager.getRepository(PasswordResetEntity).save(passwordResetEntity);
    }
    _sendPasswordResetEmail(account, passwordResetEntity.resetToken, false);
  });
}

export async function resetPassword(username: string, password: string, resetToken: string): Promise<AccountEntity> {
  const account: AccountEntity = await getRepository(AccountEntity).findOne({
    relations: ['contactInfo', 'organization', 'operationHours'],
    where: { username }
  });
  const passwordResetEntity: PasswordResetEntity = await getRepository(PasswordResetEntity).findOne({
    where: { resetToken, account }
  });

  if (!passwordResetEntity) {
    throw new FoodWebError('Password reset was unsuccessful. Please request another password reset email.');
  }

  await getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(PasswordResetEntity).remove(passwordResetEntity);
    await savePassword(manager, account, password, null, true);
    await _sendPasswordResetEmail(account, resetToken, true);
  });
  return account;
}

function _genPasswordResetEntity(account: AccountEntity): PasswordResetEntity {
  const resetToken: string = randomBytes(10).toString('hex'); // Gen 20 char token.
  const passwordResetEntity = new PasswordResetEntity();
  passwordResetEntity.resetToken = resetToken;
  passwordResetEntity.account = account;
  return passwordResetEntity;
}

async function _sendPasswordResetEmail(account: AccountEntity, resetToken: string, resetComplete: boolean): Promise<void> {
  const template: string = (resetComplete ? 'password-reset-success' : 'password-reset');
  return sendEmail(
    MailTransporter.NOREPLY,
    account.contactInfo.email,
    'Reset FoodWeb Password',
    template,
    account,
    { resetToken }
  );
}
