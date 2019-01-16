import { getConnection, EntityManager, getRepository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { saveUnverifiedAccount } from './account-verification.model';
import { formatOperationHoursTimes } from './../helpers/operation-hours-converter';
import { AccountEntity } from './../entity/account.entity';
import { PasswordEntity } from './../entity/password.entity';
import { getPasswordId } from './../helpers/password-match';
import { FoodWebError } from './../helpers/food-web-error';
import { Account } from './../../../shared/src/interfaces/account';
import { Validation } from './../../../shared/src/constants/validation';

export async function createAccount(account: Account, password: string): Promise<AccountEntity> {
  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, account);
    await _savePassword(manager, createdAccount, password);
    await saveUnverifiedAccount(createdAccount, manager);
  });

  formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return createdAccount;
}

export async function updateAccount(account: Account, password: string, oldPassword: string): Promise<AccountEntity> {
  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account);
    if (password) {
      await _savePassword(manager, updatedAccount, password, oldPassword);
    }
  });

  formatOperationHoursTimes(updatedAccount.operationHours);
  return updatedAccount;
}

export async function getAccounts(): Promise<AccountEntity[]> {
  return getRepository(AccountEntity).find({
    relations: ['contactInfo', 'organization', 'operationHours']
  });
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

async function _savePassword(manager: EntityManager, account: AccountEntity, password: string, oldPassword?: string): Promise<void> {
  _validatePassword(password);
  const salt: string = await genSalt();
  const passwordHash: string = await hash(password, salt);
  const passwordEntity = new PasswordEntity();
  passwordEntity.passwordHash = passwordHash;
  passwordEntity.account = account;
  if (oldPassword) {
    const oldPasswordId: number = await _getOldPasswordId(account, oldPassword);
    passwordEntity.id = oldPasswordId;
  }
  await manager.getRepository(PasswordEntity).save(passwordEntity);
}

function _validatePassword(password: string): void {
  if (!Validation.PASSWORD_REGEX.test(password)) {
    throw new FoodWebError('Password must contain at least 6 characters');
  }
}

async function _getOldPasswordId(account: Account, oldPassword: string): Promise<number> {
  const matchId: number = await getPasswordId(account, oldPassword);
  if (matchId == null) {
    throw new FoodWebError('Current password match failed');
  }
  return matchId
}
