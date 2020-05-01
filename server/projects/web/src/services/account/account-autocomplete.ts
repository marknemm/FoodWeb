import { AccountEntity } from '~entity';
import { OrmSelectQueryBuilder, getOrmRepository } from '~orm';

export function lookupAccountAutocomplete(lookupStr: string): Promise<Partial<AccountEntity>> {
  let queryBuilder: OrmSelectQueryBuilder<AccountEntity> = getOrmRepository(AccountEntity).createQueryBuilder('account');
  return null;
}
