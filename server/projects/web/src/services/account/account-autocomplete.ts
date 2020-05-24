import { AccountEntity } from '~entity';
import { getOrmRepository, OrmSelectQueryBuilder, preprocessFullTextQuery } from '~orm';
import { AccountAutocompleteRequest } from '~shared';
import { AccountAutocompleteItem } from '~shared';

/**
 * Generates an account autocomplete feed.
 * @param autocompleteReq The account autocomplete request.
 * @return A promise that resolves to a list of partial accounts.
 */
export function genAccountAutocomplete(autocompleteReq: AccountAutocompleteRequest): Promise<AccountAutocompleteItem[]> {
  let queryBuilder: OrmSelectQueryBuilder<AccountEntity> = getOrmRepository(AccountEntity).createQueryBuilder('account');
  queryBuilder = _genSelects(queryBuilder);
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genFilters(queryBuilder, autocompleteReq);
  queryBuilder = queryBuilder.orderBy('rank', 'DESC');
  queryBuilder = queryBuilder.limit(20);
  return queryBuilder.getMany();
}

/**
 * Generates the select fields for the account autocomplete query.
 * @param queryBuilder The account autocomplete query builder.
 * @return The modified input queryBuilder.
 */
function _genSelects(queryBuilder: OrmSelectQueryBuilder<AccountEntity>): OrmSelectQueryBuilder<AccountEntity> {
  return queryBuilder.select([
    'TS_RANK_CD(fullTextSearch.fullText, :fullTextQuery) AS rank',
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
  return queryBuilder
    .innerJoin(
      'FullTextSearch', 'fullTextSearch',
      `fullTextSearch.entityId = account.id AND fullTextSearch.entityTable = 'Account'`
    )
    .innerJoin('account.contactInfo', 'contactInfo')
    .leftJoin('account.organization', 'organization')
    .leftJoin('account.volunteer', 'volunteer');
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
  // Always perform fulltext search filtering.
  const fullTextQuery: string = preprocessFullTextQuery(autocompleteReq.fullTextQuery);
  queryBuilder = queryBuilder.andWhere('TO_TSQUERY(:fullTextQuery) @@ fullTextSearch.fullText', { fullTextQuery });

  // Filter by account type if specified.
  if (autocompleteReq.accountType) {
    queryBuilder = queryBuilder.andWhere(
      'account.accountType = :accountType',
      { accountType: autocompleteReq.accountType }
    );
  }

  return queryBuilder;
}
