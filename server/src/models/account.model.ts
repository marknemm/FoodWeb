import { getConnection, EntityManager, getRepository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { saveUnverifiedAccount } from './account-verification.model';
import { formatOperationHoursTimes } from './../helpers/operation-hours-converter';
import { AccountEntity } from './../entity/account.entity';
import { PasswordEntity } from './../entity/password.entity';
import { checkPasswordMatch } from './../helpers/password-match';
import { FoodWebError } from './../helpers/food-web-error';
import { Account } from './../../../shared/src/interfaces/account';
import { Validation } from './../../../shared/src/constants/validation';

export async function createAccount(account: Account, password: string): Promise<AccountEntity> {
  _validateAccount(account);
  _validatePassword(password);

  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, account);
    await _savePassword(manager, password, createdAccount);
    await saveUnverifiedAccount(createdAccount, manager);
  });

  formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return createdAccount;
}

export async function updateAccount(account: Account, password: string, oldPassword: string): Promise<AccountEntity> {
  _validateAccount(account);
  if (password) {
    _validatePassword(password);
    await _validateOldPassword(account, oldPassword);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account);
    if (password) {
      await _savePassword(manager, password, updatedAccount);
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

async function _validateOldPassword(account: Account, oldPassword: string): Promise<void> {
  const validated: boolean = await checkPasswordMatch(account, oldPassword);
  if (!validated) {
    throw new FoodWebError('Current password match failed');
  }
}

function _saveAccount(manager: EntityManager, account: Account): Promise<AccountEntity> {
  return manager.getRepository(AccountEntity).save(account as AccountEntity);
}

async function _savePassword(manager: EntityManager, password: string, account: AccountEntity): Promise<void> {
  const salt: string = await genSalt();
  const passwordHash: string = await hash(password, salt);
  const passwordEntity = new PasswordEntity();
  passwordEntity.passwordHash = passwordHash;
  passwordEntity.account = account;
  await manager.getRepository(PasswordEntity).save(passwordEntity);
}
