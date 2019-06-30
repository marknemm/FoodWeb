import { getRepository, FindConditions } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { Account } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';

export interface AccountsQueryResult {
  accounts: AccountEntity[];
  totalCount: number;
}

const _accountHelper = new AccountHelper();

export async function readAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  let readRequest: AccountReadRequest = { page: 1, limit: 1 };
  (typeof idOrUsername === 'number')
    ? readRequest.id = idOrUsername
    : readRequest.username = idOrUsername;
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, myAccount);
  return queryResult.accounts[0];
}

export async function readAccounts(request: AccountReadRequest, myAccount?: Account): Promise<AccountsQueryResult> {
  const [accounts, totalCount]: [AccountEntity[], number] = await getRepository(AccountEntity).findAndCount({
    where: _genFindConditions(request),
    skip: (request.page - 1) * request.limit,
    take: request.limit,
    order: { username: 'ASC' }
  });

  _postProcessAccounts(accounts, myAccount);
  return { accounts, totalCount };
}

function _genFindConditions(request: AccountReadRequest): FindConditions<AccountEntity> {
  const conditions: FindConditions<AccountEntity> = Object.assign({}, request);
  delete conditions['page'];
  delete conditions['limit'];
  return conditions;
}

function _postProcessAccounts(accounts: AccountEntity[], myAccount: Account): void {
  accounts.forEach((account: AccountEntity) => {
    const isMyAccount: boolean = _accountHelper.isMyAccount(myAccount, account.id);
    formatOperationHoursTimes(account.operationHours);
    _delVolunteerAddrIfNotMyAccount(account, isMyAccount);
    _setVerifiedIfMyAccount(account, isMyAccount, myAccount);
  });
}

function _delVolunteerAddrIfNotMyAccount(account: AccountEntity, isMyAccount: boolean): void {
  if (account.accountType === 'Volunteer' && !isMyAccount) {
    delete account.contactInfo.streetAddress;
    delete account.contactInfo.city;
    delete account.contactInfo.stateProvince;
    delete account.contactInfo.postalCode;
    delete account.contactInfo.location;
  }
}

function _setVerifiedIfMyAccount(account: AccountEntity, isMyAccount: boolean, myAccount: Account): void {
  if (isMyAccount) {
    account.verified = myAccount.verified;
  }
}
