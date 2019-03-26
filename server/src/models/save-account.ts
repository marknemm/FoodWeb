import { getConnection, EntityManager } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { saveUnverifiedAccount } from './account-verification';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { AccountEntity } from '../entity/account.entity';
import { PasswordEntity } from '../entity/password.entity';
import { getPasswordId } from '../helpers/password-match';
import { AccountHelper, Account } from '../../../shared/src/helpers/account-helper';
import { FoodWebError } from '../../../shared/src/helpers/food-web-error';

const accountHelper = new AccountHelper();

export async function createAccount(account: Account, password: string): Promise<AccountEntity> {
  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, null, account);
    await savePassword(manager, createdAccount, password);
    await saveUnverifiedAccount(createdAccount, manager);
  });

  formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return createdAccount;
}

export async function updateAccount(myAccount: Account, account: Account, password: string, oldPassword: string): Promise<AccountEntity> {
  if (!accountHelper.isMyAccount(myAccount, account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account, myAccount);
    if (password) {
      oldPassword = (oldPassword ? oldPassword : ' '); // Ensure we have an oldPassword to check against for extra security!
      await savePassword(manager, updatedAccount, password, oldPassword, accountHelper.isAdmin(myAccount));
    }
  });

  formatOperationHoursTimes(updatedAccount.operationHours);
  return updatedAccount;
}

export async function savePassword(manager: EntityManager, account: AccountEntity, password: string, oldPassword?: string, isReset = false): Promise<void> {
  accountHelper.validatePassword(password);
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

async function _saveAccount(manager: EntityManager, account: Account, myAccount?: Account): Promise<AccountEntity> {
  const allowAdminAccountType = (myAccount && myAccount.accountType === 'Admin');
  accountHelper.validateAccount(account, allowAdminAccountType);
  return manager.getRepository(AccountEntity).save(account as AccountEntity);
}
