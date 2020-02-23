import { genSalt, hash } from 'bcrypt';
import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from 'database/src/entity/account.entity';
import { PasswordEntity } from 'database/src/entity/password.entity';
import { getPasswordId } from '~web/helpers/misc/password-match';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { AccountHelper, PasswordUpdateRequest } from '~shared';

const _accountHelper = new AccountHelper();

export async function updatePassword(updateReq: PasswordUpdateRequest, myAccount: AccountEntity): Promise<void> {
  const password = updateReq.password;
  // Ensure we have an oldPassword to check against for extra security!
  const oldPassword = (updateReq.oldPassword ? updateReq.oldPassword : ' ');
  await getConnection().transaction(async (manager: EntityManager) => {
    await savePassword(manager, myAccount, password, oldPassword);
  });
}

export async function savePassword(
  manager: EntityManager,
  myAccount: AccountEntity,
  password: string,
  oldPassword?: string,
  isReset = false
): Promise<void> {
  _validatePassword(password);
  const passwordHash: string = await _genPasswordHash(password);
  const passwordEntity: PasswordEntity = _genPasswordEntity(passwordHash, myAccount);
  passwordEntity.id = await _getOldPasswordId(manager, myAccount, oldPassword, isReset);
  // If trying to update password without providing valid old password or going through password reset link, this will fail.
  // The failure will be due to saving a password with a duplicate account reference (must be unique 1-1 relationship).
  await manager.getRepository(PasswordEntity).save(passwordEntity);
}

function _validatePassword(password: string): void {
  const passwordErr: string = _accountHelper.validatePassword(password);
  if (passwordErr) {
    throw new FoodWebError(passwordErr);
  }
}

async function _genPasswordHash(password: string): Promise<string> {
  const salt: string = await genSalt();
  return hash(password, salt);
}

function _genPasswordEntity(passwordHash: string, account: AccountEntity): PasswordEntity {
  const passwordEntity = new PasswordEntity();
  passwordEntity.passwordHash = passwordHash;
  passwordEntity.account = account;
  return passwordEntity;
}

async function _getOldPasswordId(manager: EntityManager, account: AccountEntity, oldPassword: string, isReset: boolean): Promise<number> {
  if (isReset) {
    return (await manager.getRepository(PasswordEntity).findOne(
      { where: { account } }
    )).id;
  }
  if (oldPassword) {
    const matchId: number = await getPasswordId(account, oldPassword);
    if (matchId == null) {
      throw new FoodWebError('Current password match failed', 401);
    }
    return matchId;
  }
  return undefined;
}
