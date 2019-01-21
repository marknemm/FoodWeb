import { getRepository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { AccountReadFilters } from '../../../shared/src/interfaces/account-read-filters';

export async function getAccounts(filters: AccountReadFilters, page: number, limit: number): Promise<AccountEntity[]> {
  const accounts: AccountEntity[] = await getRepository(AccountEntity).find({
    relations: ['contactInfo', 'organization', 'operationHours'],
    where: filters,
    skip: (page - 1) * limit,
    take: limit
  });

  accounts.forEach((account: AccountEntity) => formatOperationHoursTimes(account.operationHours));
  return accounts;
}
