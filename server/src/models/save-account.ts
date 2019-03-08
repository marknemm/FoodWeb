import { getConnection, EntityManager } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { saveUnverifiedAccount } from './account-verification';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { AccountEntity } from '../entity/account.entity';
import { PasswordEntity } from '../entity/password.entity';
import { getPasswordId } from '../helpers/password-match';
import { FoodWebError } from '../helpers/food-web-error';
import { Account } from '../../../shared/src/interfaces/account';
import { Validation } from '../../../shared/src/constants/validation';

export async function createAccount(account: Account, password: string): Promise<AccountEntity> {
  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, account);
    await savePassword(manager, createdAccount, password);
    await saveUnverifiedAccount(createdAccount, manager);
  });

  formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return createdAccount;
}

export async function updateAccount(userId: number, account: Account, password: string, oldPassword: string): Promise<AccountEntity> {
  if (userId !== account.id) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account);
    if (password) {
      oldPassword = (oldPassword ? oldPassword : ' '); // Ensure we have an oldPassword to check against for extra security!
      await savePassword(manager, updatedAccount, password, oldPassword);
    }
  });

  formatOperationHoursTimes(updatedAccount.operationHours);
  return updatedAccount;
}

export async function savePassword(manager: EntityManager, account: AccountEntity, password: string, oldPassword?: string, isReset = false): Promise<void> {
  _validatePassword(password);
  const passwordHash: string = await _genPasswordHash(password);
  const passwordEntity: PasswordEntity = _genPasswordEntity(passwordHash, account);
  passwordEntity.id = await _getOldPasswordId(manager, account, oldPassword, isReset);
  // If trying to update password without providing valid old password or going through password reset link, this will fail.
  // The failure will be due to saving a password with a duplicate account reference (must be unique 1-1 relationship).
  await manager.getRepository(PasswordEntity).save(passwordEntity);
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
  if (oldPassword) {
    const matchId: number = await getPasswordId(account, oldPassword);
    if (matchId == null)
      throw new FoodWebError('Current password match failed', 401);
    return matchId;
  }
  if (isReset) {
    return (await manager.getRepository(PasswordEntity).findOne(
      { where: { account } }
    )).id;
  }
  return undefined;
}

async function _saveAccount(manager: EntityManager, account: Account): Promise<AccountEntity> {
  _validateAccount(account);
  return manager.getRepository(AccountEntity).save(account as AccountEntity);
}

function _validateAccount(account: Account): void {
  if (!Validation.EMAIL_REGEX.test(account.contactInfo.email)) {
    throw new FoodWebError('Invalid email address');
  }
  if (!Validation.PHONE_REGEX.test(account.contactInfo.phoneNumber)) {
    throw new FoodWebError('Invalid phone number');
  }
  if (!Validation.POSTAL_CODE_REGEX.test(account.contactInfo.postalCode)) {
    throw new FoodWebError('Invalid zip/postal code');
  }
}

function _validatePassword(password: string): void {
  if (!Validation.PASSWORD_REGEX.test(password)) {
    throw new FoodWebError('Password must contain at least 6 characters');
  }
}
