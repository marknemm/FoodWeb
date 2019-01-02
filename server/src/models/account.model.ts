import { getConnection, EntityManager, getRepository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { formatOperationHoursTimes } from './../helpers/operation-hours-converter';
import { AccountEntity } from './../entity/account.entity';
import { PasswordEntity } from './../entity/password.entity';
import { checkPasswordMatch } from './../helpers/password-match';
import { FoodWebError } from './../helpers/food-web-error';
import { Account } from './../../../shared/src/interfaces/account';
import { Validation } from './../../../shared/src/constants/validation';

export async function createAccount(account: Account, password: string): Promise<AccountEntity> {
  _validateData(account, password); // Throws error on invalid field values.
  return _saveAccount(account, password);
}

export async function getAccounts(): Promise<AccountEntity[]> {
  return getRepository(AccountEntity).find({
    relations: ['contactInfo', 'organization', 'operationHours']
  });
}

export async function updateAccount(account: Account, password: string, oldPassword: string): Promise<AccountEntity> {
  _validateData(account, password, !!password);
  await _validateOldPassword(account, password, oldPassword);
  return _saveAccount(account, password);
}

function _validateData(account: Account, password: string, validatePassword = true): void {
  if (validatePassword && !Validation.PASSWORD_REGEX.test(password)) {
    throw new FoodWebError('Password must contain at least 6 characters');
  }
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

async function _validateOldPassword(account: Account, password: string, oldPassword: string): Promise<void> {
  if (password) {
    const validated: boolean = await checkPasswordMatch(account, oldPassword);
    if (!validated) {
      throw new FoodWebError('Current password match failed');
    }
  }
}

async function _saveAccount(account: Account, password: string): Promise<AccountEntity> {
  let savedAccount: AccountEntity;

  await getConnection().transaction(async (manager: EntityManager) => {
    savedAccount = await manager.getRepository(AccountEntity).save(account as AccountEntity);
    if (password) {
      const passwordEntity: PasswordEntity = await _genPasswordEntity(savedAccount, password);
      await manager.getRepository(PasswordEntity).save(passwordEntity);
    }
  });

  formatOperationHoursTimes(savedAccount.operationHours);
  return savedAccount;
}

async function _genPasswordEntity(account: AccountEntity, password: string): Promise<PasswordEntity> {
  const salt: string = await genSalt();
  const passwordHash: string = await hash(password, salt);
  const passwordEntity = new PasswordEntity();
  passwordEntity.passwordHash = passwordHash;
  passwordEntity.account = account;
  return passwordEntity;
}
