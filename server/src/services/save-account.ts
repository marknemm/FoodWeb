import { EntityManager, getConnection, QueryFailedError, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { OperationHoursEntity } from '../entity/operation-hours.entity';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { geocode, geoTimezone } from '../helpers/geocoder';
import { AccountUpdateRequest } from '../interfaces/account/account-update-request';
import { UpdateDiff } from '../interfaces/update-diff';
import { Account, AccountCreateRequest, AccountHelper, OperationHours, OperationHoursHelper } from '../shared';
import { createUnverifiedAccount } from './account-verification';
import { savePassword } from './save-password';

/**
 * Data generated when creating a new account.
 */
export interface NewAccountData {
  account: AccountEntity;
  unverifiedAccount: UnverifiedAccountEntity;
}

const _accountHelper = new AccountHelper();
const _opHoursHelper = new OperationHoursHelper();

export async function createAccount(request: AccountCreateRequest): Promise<NewAccountData> {
  let createdAccount: AccountEntity;
  let unverifiedAccount: UnverifiedAccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, request.account);
    await savePassword(manager, createdAccount, request.password);
    unverifiedAccount = await createUnverifiedAccount(createdAccount, manager);
  });

  _opHoursHelper.formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return { account: createdAccount, unverifiedAccount };
}

export async function updateAccount(updateReq: AccountUpdateRequest, myAccount: Account): Promise<UpdateDiff<AccountEntity>> {
  if (!_accountHelper.isMyAccount(myAccount, updateReq.account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  // Ensure we do not overwrite last seen notification ID.
  updateReq.account.lastSeenNotificationId = myAccount.lastSeenNotificationId;

  const updatedAccount: AccountEntity = await getConnection().transaction((manager: EntityManager) =>
    _saveAccount(manager, updateReq.account, myAccount)
  );

  _opHoursHelper.formatOperationHoursTimes(updatedAccount.operationHours);
  return { old: <AccountEntity>myAccount, new: updatedAccount };
}

async function _saveAccount(manager: EntityManager, account: Account, myAccount?: Account): Promise<AccountEntity> {
  const accountRepo: Repository<AccountEntity> = manager.getRepository(AccountEntity);
  const operationHoursRepo: Repository<OperationHoursEntity> = manager.getRepository(OperationHoursEntity);
  _validateAccount(account, myAccount);
  _ensureEitherOrganizationOrVolunteer(account);
  _ensureAccountHasProfileImg(account);
  await _setGeocoordinatesIfNewAddress(account, myAccount);
  account.contactInfo.phoneNumber = _accountHelper.formatPhoneNumber(account.contactInfo.phoneNumber);

  if (account.id) {
    await operationHoursRepo.delete({ account: { id: account.id } });
  }
  const savedAccount: AccountEntity = await accountRepo.save(account as AccountEntity).catch(
    (err: QueryFailedError) => { throw _handleSaveQueryFailError(err); }
  );
  await _insertOperationHours(operationHoursRepo, savedAccount.id, account.operationHours);
  return accountRepo.findOne({ id: account.id });
}

function _validateAccount(account: Account, myAccount?: Account): void {
  const allowAdminAccountType = (myAccount && myAccount.accountType === 'Admin');
  const accountErr: string = _accountHelper.validateAccount(account, allowAdminAccountType);
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
  if (!account.profileImgUrl || /^\.?\/assets\/[A-Z]\.svg$/.test(account.profileImgUrl)) {
    const firstLetter: string = (account.accountType === 'Volunteer')
      ? account.volunteer.lastName.charAt(0).toUpperCase()
      : account.organization.organizationName.charAt(0).toUpperCase();
    account.profileImgUrl = `./assets/${firstLetter}.svg`;
  }
}

async function _setGeocoordinatesIfNewAddress(account: Account, myAccount: Account): Promise<void> {
  if (!myAccount || account.contactInfo.streetAddress !== myAccount.contactInfo.streetAddress) {
    account.contactInfo.location = await geocode(account.contactInfo);
    account.contactInfo.timezone = geoTimezone(account.contactInfo.location);
  }
}

function _handleSaveQueryFailError(err: QueryFailedError): Error {
  return (err.message.indexOf('duplicate key') >= 0)
    ? new FoodWebError('Username already registered, please choose a different one', 400)
    : err;
}

async function _insertOperationHours(repo: Repository<OperationHoursEntity>, accountId: number, operationHoursArr: OperationHours[]): Promise<void> {
  operationHoursArr = _opHoursHelper.sortOperationHours(operationHoursArr);
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
