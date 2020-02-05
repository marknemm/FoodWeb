import { plainToClass } from 'class-transformer';
import { QueryFailedError } from 'typeorm';
import { AccountEntity } from '../../entity/account.entity';
import { ContactInfoEntity } from '../../entity/contact-info.entity';
import { OperationHoursEntity } from '../../entity/operation-hours.entity';
import { UnverifiedAccountEntity } from '../../entity/unverified-account.entity';
import { OrmEntityManager, OrmRepository } from '../../helpers/database/orm';
import { geocode, geoTimezone } from '../../helpers/map/geocoder';
import { FoodWebError } from '../../helpers/response/food-web-error';
import { AccountUpdateRequest } from '../../interfaces/account/account-update-request';
import { UpdateDiff } from '../../interfaces/update-diff';
import { AccountCreateRequest, AccountHelper, AccountSectionUpdateReqeust, NotificationSettings, OperationHoursHelper } from '../../shared';
import { updateMapRouteEndpoints } from '../map/save-map-route';
import { savePassword } from '../password/save-password';
import { createUnverifiedAccount } from './account-verification';

const _accountHelper = new AccountHelper();
const _opHoursHelper = new OperationHoursHelper();

export async function createAccount(request: AccountCreateRequest): Promise<NewAccountData> {
  const accountToSave: AccountEntity = plainToClass(AccountEntity, request.account);
  let createdAccount: AccountEntity;
  let unverifiedAccount: UnverifiedAccountEntity;

  await OrmEntityManager.transaction(async (manager: OrmEntityManager) => {
    createdAccount = await _saveAccount(manager, accountToSave);
    await savePassword(manager, createdAccount, request.password);
    unverifiedAccount = await createUnverifiedAccount(createdAccount, manager);
  });

  createdAccount.verified = false;
  return { account: createdAccount, unverifiedAccount };
}

export function updateAccountSection(
  updateReq: AccountSectionUpdateReqeust,
  myAccount: AccountEntity
): Promise<UpdateDiff<AccountEntity>> {
  if (updateReq.accountSectionName === 'notificationSettings') {
    return _updateNotificationsSettings(updateReq, myAccount);
  }
  // Shallow copy orignal account to set update field(s).
  const account: AccountEntity = Object.assign(new AccountEntity(), myAccount);
  account[updateReq.accountSectionName] = updateReq.accountSection;
  return updateAccount({ account }, myAccount);
}

function _updateNotificationsSettings(
  updateReq: AccountSectionUpdateReqeust<NotificationSettings>,
  myAccount: AccountEntity
): Promise<UpdateDiff<AccountEntity>> {
  // Shallow copy orignal account to set update field(s).
  const account: AccountEntity = Object.assign(new AccountEntity(), myAccount);
  account.contactInfo = Object.assign(new ContactInfoEntity(), account.contactInfo);
  account.contactInfo.enableEmail = updateReq.accountSection.enableEmail;
  account.contactInfo.enablePushNotification = updateReq.accountSection.enablePushNotification;
  account.contactInfo.notifyForEachDonation = updateReq.accountSection.notifyForEachDonation;
  return updateAccount({ account }, myAccount);
}

export async function updateAccount(updateReq: AccountUpdateRequest, myAccount: AccountEntity): Promise<UpdateDiff<AccountEntity>> {
  if (!_accountHelper.isMyAccount(myAccount, updateReq.account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  // Ensure we do not overwrite last seen notification ID.
  updateReq.account.lastSeenNotificationId = myAccount.lastSeenNotificationId;
  const accountToSave: AccountEntity = plainToClass(AccountEntity, updateReq.account);

  const updatedAccount: AccountEntity = await OrmEntityManager.transaction((manager: OrmEntityManager) =>
    _saveAccount(manager, accountToSave, myAccount)
  );

  return { old: myAccount, new: updatedAccount };
}

async function _saveAccount(manager: OrmEntityManager, account: AccountEntity, myAccount?: AccountEntity): Promise<AccountEntity> {
  const accountRepo: OrmRepository<AccountEntity> = manager.getRepository(AccountEntity);
  const operationHoursRepo: OrmRepository<OperationHoursEntity> = manager.getRepository(OperationHoursEntity);
  _ensureEitherOrganizationOrVolunteer(account);
  _ensureAccountHasProfileImg(account);
  _validateAccount(account, myAccount);
  await _checkForAndProcessNewAddress(manager, account, myAccount);
  account.contactInfo.phoneNumber = _accountHelper.formatPhoneNumber(account.contactInfo.phoneNumber);

  if (account.id) {
    // Must delete all operation hours associated with account because they are re-inserted upon update.
    await operationHoursRepo.delete({ account: { id: account.id } });
  }
  const savedAccount: AccountEntity = await accountRepo.save(account as AccountEntity).catch(
    (err: QueryFailedError) => { throw _handleSaveQueryFailError(err); }
  );
  await _insertOperationHours(operationHoursRepo, savedAccount.id, account.operationHours);
  return accountRepo.findOne({ id: account.id });
}

function _validateAccount(account: AccountEntity, myAccount?: AccountEntity): void {
  const allowAdminAccountType = (myAccount && myAccount.accountType === 'Admin');
  const accountErr: string = _accountHelper.validateAccount(account, allowAdminAccountType);
  if (accountErr) {
    throw new FoodWebError(accountErr);
  }
}

function _ensureEitherOrganizationOrVolunteer(account: AccountEntity): void {
  if (account.accountType === 'Volunteer') {
    account.organization = null;
  } else {
    account.volunteer = null;
    _ensureEitherDonorOrReceiver(account);
  }
}

function _ensureEitherDonorOrReceiver(account: AccountEntity): void {
  if (account.organization) {
    (account.accountType === 'Donor')
      ? account.organization.receiver = null
      : account.organization.donor = null;
  }
}

function _ensureAccountHasProfileImg(account: AccountEntity): void {
  if (!account.profileImgUrl || /^\.?\/assets\/[A-Z]\.svg$/.test(account.profileImgUrl)) {
    const firstLetter: string = (account.accountType === 'Volunteer')
      ? account.volunteer.lastName.charAt(0).toUpperCase()
      : account.organization.name.charAt(0).toUpperCase();
    account.profileImgUrl = `./assets/${firstLetter}.svg`;
  }
}

async function _checkForAndProcessNewAddress(manager: OrmEntityManager, account: AccountEntity, myAccount: AccountEntity): Promise<void> {
  if (
    !myAccount
    || (account.contactInfo.streetAddress !== myAccount.contactInfo.streetAddress)
    || (account.contactInfo.city !== myAccount.contactInfo.city)
  ) {
    account.contactInfo.location = await geocode(account.contactInfo);
    account.contactInfo.timezone = geoTimezone(account.contactInfo.location);
    if (myAccount) {
      // Update all cached routes that referenced the old GPS location to use the new GPS location.
      await updateMapRouteEndpoints(myAccount.contactInfo, account.contactInfo, manager);
    }
  }
}

function _handleSaveQueryFailError(err: QueryFailedError): Error {
  return (err.message.indexOf('duplicate key') >= 0)
    ? new FoodWebError('Username already registered, please choose a different one', 400)
    : err;
}

async function _insertOperationHours(
  repo: OrmRepository<OperationHoursEntity>,
  accountId: number,
  operationHoursArr: OperationHoursEntity[]
): Promise<void> {
  operationHoursArr = <OperationHoursEntity[]>_opHoursHelper.sortOperationHours(operationHoursArr);
  if (operationHoursArr && operationHoursArr.length !== 0) {
    // Make copy of array with shallow copy of members, and assign account field for insertion.
    const operationHoursArrCopy = (<OperationHoursEntity[]>operationHoursArr).map(
      (operationHours: OperationHoursEntity) => {
        const operationHoursCopy: OperationHoursEntity = Object.assign(new OperationHoursEntity(), operationHours);
        operationHoursCopy.account = <AccountEntity>{ id: accountId };
        return operationHoursCopy;
      }
    );
    repo.insert(operationHoursArrCopy);
  }
}

/**
 * Data generated when creating a new account.
 */
export interface NewAccountData {
  account: AccountEntity;
  unverifiedAccount: UnverifiedAccountEntity;
}