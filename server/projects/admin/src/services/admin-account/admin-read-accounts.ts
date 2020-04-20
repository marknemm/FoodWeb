import { Account, AccountEntity, AccountType } from '~entity';
import { UnverifiedAccountEntity } from '~entity';
import { OrmSelectQueryBuilder, QueryMod, QueryResult } from '~orm';
import { AccountReadFilters, AccountReadRequest } from '~shared';
import { queryFullAccounts, readFullAccount } from '~web/services/account/read-accounts';

/**
 * Reads a (full) single account with a matching given ID or username.
 * @param idOrUsername The ID or username of the account to read.
 * @param myAccount The account of the user issuing the request.
 * @return A promise that resolves to the found account; null/undefined if the account was not found.
 */
export function adminReadAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  return readFullAccount(idOrUsername, myAccount);
}

/**
 * Reads all (full) accounts based off of criteria present in a given account read request.
 * @param request The account read request.
 * @param myAccount The account of the user issuing the request.
 * @return A promise that resolves to the query result of the account read.
 */
export function adminReadAccounts(request: AccountReadRequest, myAccount: Account): Promise<QueryResult<AccountEntity>> {
  return adminQueryAccounts(request, myAccount).exec();
}

/**
 * Queries all (full) accounts based off of criterial present in a given account read request, and any query mods added
 * to the returned query mod object.
 * @param request The account read request.
 * @param myAccount The account of the user issuing the request.
 * @return The query mod object that may be used to modify and execute the account read query.
 */
export function adminQueryAccounts(request: AccountReadRequest, myAccount?: Account): QueryMod<AccountEntity> {
  return queryFullAccounts(request, myAccount).modQuery(
    (queryBuilder: OrmSelectQueryBuilder<AccountEntity>) => _genAdminWhereConditions(queryBuilder, request)
  );
}

/**
 * Generates admin level where conditions for an account read request.
 * @param queryBuilder The select query builder.
 * @param filters The account read request filters.
 * @return The input query builder with admin where conditions added.
 */
function _genAdminWhereConditions(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters
): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = _genAccountVerifiedCondition(queryBuilder, filters);
  queryBuilder = _genSignedAgreementCondition(queryBuilder, filters);
  return queryBuilder;
}

/**
 * Generates account verification filters for an account read request.
 * @param queryBuilder The select query builder.
 * @param filters The account read request filters.
 * @return The input query builder with an account verification condition added (if present in given filters).
 */
function _genAccountVerifiedCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters
): OrmSelectQueryBuilder<AccountEntity> {
  if (filters.verified != null) {
    const accountVerified = (filters.verified === 'true');
    queryBuilder = queryBuilder.andWhere(`${accountVerified ? 'NOT' : ''} EXISTS (
      SELECT  1
      FROM    "UnverifiedAccount"
      WHERE   "UnverifiedAccount"."accountId" = account.id
    )`);
  }
  return queryBuilder;
}

/**
 * Generates signed agreement condition filters for an account read request.
 * @param queryBuilder The select query builder.
 * @param filters The account read request filters.
 * @return The input query builder with a signed agreement condition added (if present in given filters).
 */
function _genSignedAgreementCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters
): OrmSelectQueryBuilder<AccountEntity> {
  if (filters.signedAgreement != null && (!filters.accountType || filters.accountType === AccountType.Volunteer)) {
    queryBuilder = queryBuilder.andWhere(`volunteer.signedAgreement = :signedAgreement`, { signedAgreement: filters.signedAgreement });
  }
  return queryBuilder;
}
