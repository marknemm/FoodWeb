import { getConnection, EntityManager, Repository } from 'typeorm';
import { createUnverifiedAccount } from './account-verification';
import { formatOperationHoursTimes, OperationHoursEntity, sortOperationHours } from '../helpers/operation-hours-converter';
import { FoodWebError } from '../helpers/food-web-error';
import { geocode } from '../helpers/geocoder';
import { AccountEntity } from '../entity/account.entity';
import { saveCreationAudit, saveUpdateAudit } from './save-audit';
import { savePassword } from './save-password';
import { OperationHours } from '../../../shared/src/interfaces/account/account';
import { AccountHelper, Account } from '../../../shared/src/helpers/account-helper';

const _accountHelper = new AccountHelper();

export async function createAccount(account: Account, password: string, recaptchaScore?: number): Promise<AccountEntity> {
  let createdAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    createdAccount = await _saveAccount(manager, account);
    await savePassword(manager, createdAccount, password);
    await createUnverifiedAccount(createdAccount, manager);
  });

  saveCreationAudit('Signup', createdAccount, recaptchaScore).catch((err: Error) => console.error(err));

  formatOperationHoursTimes(createdAccount.operationHours);
  createdAccount.verified = false;
  return createdAccount;
}

export async function updateAccount(myAccount: Account, account: Account): Promise<AccountEntity> {
  if (!_accountHelper.isMyAccount(myAccount, account.id)) {
    throw new FoodWebError('User unauthorized to update account', 401);
  }

  let updatedAccount: AccountEntity;
  await getConnection().transaction(async (manager: EntityManager) => {
    updatedAccount = await _saveAccount(manager, account, myAccount);
  });

  saveUpdateAudit('Update Account', myAccount, account);

  formatOperationHoursTimes(updatedAccount.operationHours);
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
