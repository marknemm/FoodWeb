import { AccountEntity } from '~entity';
import { getOrmRepository, OrmSelectQueryBuilder, preprocessFullTextQuery } from '~orm';
import { AccountAutocompleteRequest } from '~shared';

/**
 * Generates an account autocomplete feed.
 * @param autocompleteReq The account autocomplete request.
 * @return A promise that resolves to a list of partial accounts.
 */
export function genAccountAutocomplete(autocompleteReq: AccountAutocompleteRequest): Promise<Partial<AccountEntity>[]> {
  let queryBuilder: OrmSelectQueryBuilder<AccountEntity> = getOrmRepository(AccountEntity).createQueryBuilder('account');
  queryBuilder = _genSelects(queryBuilder);
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genFilters(queryBuilder, autocompleteReq);
  queryBuilder = queryBuilder.take(20);
  return queryBuilder.getMany();
}

/**
 * Generates the select fields for the account autocomplete query.
 * @param queryBuilder The account autocomplete query builder.
 * @return The modified input queryBuilder.
 */
function _genSelects(queryBuilder: OrmSelectQueryBuilder<AccountEntity>): OrmSelectQueryBuilder<AccountEntity> {
  return queryBuilder.select([
    'account.id',
    'account.accountType',
    'contactInfo.id',
    'contactInfo.email',
    'contactInfo.phoneNumber',
    'contactInfo.streetAddress',
    'contactInfo.city',
    'contactInfo.stateProvince',
    'contactInfo.postalCode',
    'organization.id',
    'organization.name',
    'volunteer.id',
    'volunteer.firstName',
    'volunteer.lastName'
  ]);
}

/**
 * Generates the join statements for the account autocomplete query.
 * @param queryBuilder The account autocomplete query builder.
 * @return The modified input queryBuilder.
 */
function _genJoins(queryBuilder: OrmSelectQueryBuilder<AccountEntity>): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = queryBuilder.innerJoin(
    'FullTextSearch', 'fullTextSearch',
    `fullTextSearch.entityId = account.id AND fullTextSearch.entityTable = 'Account'`
  );
  queryBuilder = queryBuilder.innerJoin('account.contactInfo', 'contactInfo');
  queryBuilder = queryBuilder.leftJoin('account.organization', 'organization');
  queryBuilder = queryBuilder.leftJoin('account.volunteer', 'volunteer');
  return queryBuilder;
}

/**
 * Generates the where clause filters for the account autocomplete query.
 * @param queryBuilder The account autocomplete query builder.
 * @return The modified input queryBuilder.
 */
function _genFilters(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  autocompleteReq: AccountAutocompleteRequest
): OrmSelectQueryBuilder<AccountEntity> {
  if (autocompleteReq.fullTextQuery?.trim()) {
    const fullTextQuery: string = preprocessFullTextQuery(autocompleteReq.fullTextQuery);
    queryBuilder = queryBuilder.andWhere('TO_TSQUERY(:fullTextQuery) @@ fullTextSearch.fullText', { fullTextQuery });
  }
  if (autocompleteReq.accountType) {
    queryBuilder = queryBuilder.andWhere(
      'account.accountType = :accountType',
      { accountType: autocompleteReq.accountType }
    );
  }
  return queryBuilder;
}
