import { getConnection, EntityManager, Repository } from 'typeorm';
import { createUnverifiedAccount } from './account-verification';
import { savePassword } from './save-password';
import { saveAudit } from './save-audit';
import { FoodWebError } from '../helpers/food-web-error';
import { geocode, geoTimezone } from '../helpers/geocoder';
import { AccountEntity } from '../entity/account.entity';
import { OperationHoursEntity } from '../entity/operation-hours.entity';
import { AccountUpdateRequest } from '../interfaces/account/account-update-request';
import { AccountHelper, Account } from '../../../shared/src/helpers/account-helper';
import { OperationHoursHelper, OperationHours } from '../../../shared/src/helpers/operation-hours-helper';
import { AccountCreateRequest } from '../../../shared/src/interfaces/account/account-create-request';

const _accountHelper = new AccountHelper();
const _opHoursHelper = new OperationHoursHelper();

export async function createAccount(request: AccountCreateRequest): Promise<AccountEntity> {
  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, request.account);
    await savePassword(manager, createdAccount, request.password);
    await createUnverifiedAccount(createdAccount, manager);
  });

  _opHoursHelper.formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  saveAudit('Signup', createdAccount, createdAccount, undefined, request.recaptchaScore);
  return createdAccount;
}

export async function updateAccount(updateReq: AccountUpdateRequest, myAccount: Account): Promise<AccountEntity> {
  if (!_accountHelper.isMyAccount(myAccount, updateReq.account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, updateReq.account, myAccount);
  });

  _opHoursHelper.formatOperationHoursTimes(updatedAccount.operationHours);
  saveAudit('Update Account', updatedAccount, updatedAccount, myAccount, updateReq.recaptchaScore);
  return updatedAccount;
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
  const savedAccount: AccountEntity = await accountRepo.save(account as AccountEntity);
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
  if (!account.profileImgUrl || /^\/assets\/[A-Z]\.svg$/.test(account.profileImgUrl)) {
    const firstLetter: string = (account.accountType === 'Volunteer')
      ? account.volunteer.lastName.charAt(0).toUpperCase()
      : account.organization.organizationName.charAt(0).toUpperCase();
    account.profileImgUrl = `/assets/${firstLetter}.svg`;
  }
}

async function _setGeocoordinatesIfNewAddress(account: Account, myAccount: Account): Promise<void> {
  if (!myAccount || account.contactInfo.streetAddress !== myAccount.contactInfo.streetAddress) {
    account.contactInfo.location = await geocode(account.contactInfo);
    account.contactInfo.timezone = geoTimezone(account.contactInfo.location);
  }
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
