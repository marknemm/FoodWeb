import { getConnection, EntityManager, Repository } from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { saveUnverifiedAccount } from './account-verification';
import { formatOperationHoursTimes, OperationHoursEntity, sortOperationHours } from '../helpers/operation-hours-converter';
import { AccountEntity } from '../entity/account.entity';
import { PasswordEntity } from '../entity/password.entity';
import { getPasswordId } from '../helpers/password-match';
import { FoodWebError } from '../helpers/food-web-error';
import { OperationHours } from '../interfaces/account/account';
import { AccountHelper, Account } from '../../../shared/src/helpers/account-helper';

const accountHelper = new AccountHelper();

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

export async function updateAccount(myAccount: Account, account: Account): Promise<AccountEntity> {
  if (!accountHelper.isMyAccount(myAccount, account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account, myAccount);
  });

  formatOperationHoursTimes(updatedAccount.operationHours);
  return updatedAccount;
}

export async function updatePassword(myAccount: AccountEntity, password: string, oldPassword: string): Promise<void> {
  oldPassword = (oldPassword ? oldPassword : ' '); // Ensure we have an oldPassword to check against for extra security!
  await getConnection().transaction(async (manager: EntityManager) => {
    await savePassword(manager, myAccount, password, oldPassword, accountHelper.isAdmin(myAccount));
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
  const passwordErr: string = accountHelper.validatePassword(password);
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

async function _saveAccount(manager: EntityManager, account: Account, myAccount?: Account): Promise<AccountEntity> {
  const accountRepo: Repository<AccountEntity> = manager.getRepository(AccountEntity);
  const operationHoursRepo: Repository<OperationHoursEntity> = manager.getRepository(OperationHoursEntity);
  _validateAccount(account, myAccount);
  _ensureEitherOrganizationOrVolunteer(account);
  _ensureAccountHasProfileImg(account);

  if (myAccount) {
    await operationHoursRepo.delete({ account: { id: myAccount.id } });
  }
  const savedAccount: AccountEntity = await accountRepo.save(account as AccountEntity);
  await _insertOperationHours(operationHoursRepo, savedAccount.id, account.operationHours);
  return accountRepo.findOne({ id: account.id });
}

function _validateAccount(account: Account, myAccount?: Account): void {
  const allowAdminAccountType = (myAccount && myAccount.accountType === 'Admin');
  const accountErr: string = accountHelper.validateAccount(account, allowAdminAccountType);
  if (accountErr) {
    throw new FoodWebError(accountErr);
  }
}

function _ensureEitherOrganizationOrVolunteer(account: Account): void {
  (account.accountType === 'Volunteer')
    ? account.organization = null
    : account.volunteer = null;
}

function _ensureAccountHasProfileImg(account: Account): void {
  if (!account.profileImgUrl || /^\/assets\/[A-Z]\.svg$/.test(account.profileImgUrl)) {
    const firstLetter: string = (account.accountType === 'Volunteer')
      ? account.volunteer.lastName.charAt(0).toUpperCase()
      : account.organization.organizationName.charAt(0).toUpperCase();
    account.profileImgUrl = `/assets/${firstLetter}.svg`;
  }
}

async function _insertOperationHours(repo: Repository<OperationHoursEntity>, accountId: number, operationHoursArr: OperationHours[]): Promise<void> {
  operationHoursArr = sortOperationHours(operationHoursArr);
  if (operationHoursArr && operationHoursArr.length !== 0) {
    // Make copy of array with shallow copy of members, and assign account field for insertion.
    const operationHoursArrCopy = (<OperationHoursEntity[]>operationHoursArr).map(
      (operationHours: OperationHoursEntity) => {
        const operationHoursCopy: OperationHoursEntity = Object.assign({}, operationHours);
        operationHoursCopy.account = <AccountEntity>{ id: accountId };
        return operationHoursCopy;
      }
    );
    repo.insert(operationHoursArrCopy);
  }
}
