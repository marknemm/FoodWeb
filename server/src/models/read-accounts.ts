import { getRepository, FindConditions } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';

export interface AccountsQueryResult {
  accounts: AccountEntity[];
  totalCount: number;
}

export async function readAccount(idOrUsername: number | string): Promise<AccountEntity> {
  let readRequest: AccountReadRequest = { page: 1, limit: 1 };
  (typeof idOrUsername === 'number')
    ? readRequest.id = idOrUsername
    : readRequest.username = idOrUsername;
  const queryResult: AccountsQueryResult = await readAccounts(readRequest);
  return queryResult.accounts[0];
}

export async function readAccounts(request: AccountReadRequest): Promise<AccountsQueryResult> {
  const [accounts, totalCount]: [AccountEntity[], number] = await getRepository(AccountEntity).findAndCount({
    where: _genFindConditions(request),
    skip: (request.page - 1) * request.limit,
    take: request.limit,
    order: { username: 'ASC' }
  });

  _processAccounts(accounts);
  return { accounts, totalCount };
}

function _genFindConditions(request: AccountReadRequest): FindConditions<AccountEntity> {
  const conditions: FindConditions<AccountEntity> = Object.assign({}, request);
  delete conditions['page'];
  delete conditions['limit'];
  return conditions;
}

function _processAccounts(accounts: AccountEntity[]): void {
  accounts.forEach((account: AccountEntity) => {
    formatOperationHoursTimes(account.operationHours);
  });
}
