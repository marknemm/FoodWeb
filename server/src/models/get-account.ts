import { getRepository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { AccountReadFilters } from '../../../shared/src/interfaces/account/account-read-filters';

export interface AccountsQueryResult {
  accounts: AccountEntity[];
  totalCount: number;
}

export async function getAccounts(filters: AccountReadFilters, page: number, limit: number): Promise<AccountsQueryResult> {
  const includeAdminFilters: AccountReadFilters = Object.assign({}, filters);
  includeAdminFilters.accountType = 'Admin';

  const [accounts, totalCount]: [AccountEntity[], number] = await getRepository(AccountEntity).findAndCount({
    relations: ['contactInfo', 'organization', 'operationHours'],
    where: [filters, includeAdminFilters],
    skip: (page - 1) * limit,
    take: limit
  });

  accounts.forEach((account: AccountEntity) => formatOperationHoursTimes(account.operationHours));
  return { accounts, totalCount };
}
