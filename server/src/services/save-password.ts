import { getConnection, EntityManager } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { AccountEntity } from '../entity/account.entity';
import { PasswordEntity } from '../entity/password.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { getPasswordId } from '../helpers/password-match';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';

const _accountHelper = new AccountHelper();

export async function updatePassword(myAccount: AccountEntity, password: string, oldPassword: string): Promise<void> {
  oldPassword = (oldPassword ? oldPassword : ' '); // Ensure we have an oldPassword to check against for extra security!
  await getConnection().transaction(async (manager: EntityManager) => {
    await savePassword(manager, myAccount, password, oldPassword, _accountHelper.isAdmin(myAccount));
  });
}

export async function savePassword(manager: EntityManager, myAccount: AccountEntity, password: string, oldPassword?: string, isReset = false): Promise<void> {
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
