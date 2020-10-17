import { AccountEntity } from '~entity';
import { genPagination, genSimpleWhereConditions, getOrmRepository, OrmSelectQueryBuilder, preprocessFullTextQuery, QueryMod, QueryResult } from '~orm';
import { Account, AccountHelper, AccountReadFilters, AccountReadRequest, AccountSortBy, OperationHours, SortOptions } from '~shared';
import { LoginRequiredError } from '~web/helpers/response/foodweb-error';

const _accountHelper = new AccountHelper();

export function readAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  return _readAccount(idOrUsername, myAccount, false);
}

export function readAccounts(request: AccountReadRequest, myAccount: Account): Promise<QueryResult<AccountEntity>> {
  return _readAccounts(request, myAccount, false);
}

export function readFullAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  return _readAccount(idOrUsername, myAccount, true);
}

export function readFullAccounts(request: AccountReadRequest, myAccount: Account): Promise<QueryResult<AccountEntity>> {
  return _readAccounts(request, myAccount, true);
}

export function queryAccounts(request: AccountReadRequest, myAccount?: Account): QueryMod<AccountEntity> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return new QueryMod<AccountEntity, QueryResult<AccountEntity>>(
    queryBuilder,
    () => _execAccountQuery(queryBuilder, myAccount, false)
  );
}

export function queryFullAccounts(request: AccountReadRequest, myAccount?: Account): QueryMod<AccountEntity> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return new QueryMod<AccountEntity, QueryResult<AccountEntity>>(
    queryBuilder,
    () => _execAccountQuery(queryBuilder, myAccount, true)
  );
}

async function _readAccount(idOrUsername: number | string, myAccount: Account, fullAccount: boolean): Promise<AccountEntity> {
  let readRequest: AccountReadRequest = { page: 1, limit: 1 };
  (typeof idOrUsername === 'number')
    ? readRequest.id = idOrUsername
    : readRequest.username = idOrUsername;
  const queryResult: QueryResult<AccountEntity> = await _readAccounts(readRequest, myAccount, fullAccount);
  return queryResult.entities[0];
}

function _readAccounts(request: AccountReadRequest, myAccount: Account, fullAccount: boolean): Promise<QueryResult<AccountEntity>> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return _execAccountQuery(queryBuilder, myAccount, fullAccount);
}

async function _execAccountQuery(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  myAccount: Account,
  fullAccount: boolean
): Promise<QueryResult<AccountEntity>> {
  const [accounts, totalCount]: [AccountEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessAccounts(accounts, myAccount, fullAccount);
  return { entities: accounts, totalCount };
}

function _buildQuery(request: AccountReadRequest, myAccount: Account): OrmSelectQueryBuilder<AccountEntity> {
  let queryBuilder: OrmSelectQueryBuilder<AccountEntity> = getOrmRepository(AccountEntity).createQueryBuilder('account');
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genWhereCondition(queryBuilder, request, myAccount);
  queryBuilder = _genOrdering(queryBuilder, request);
  queryBuilder = genPagination(queryBuilder, request);
  return queryBuilder;
}

function _genJoins(queryBuilder: OrmSelectQueryBuilder<AccountEntity>): OrmSelectQueryBuilder<AccountEntity> {
  return queryBuilder
    .innerJoin(
      'FullTextSearch', 'fullTextSearch',
      `fullTextSearch.entityId = account.id AND fullTextSearch.entityTable = 'Account'`
    )
    .innerJoinAndSelect('account.contactInfo', 'contactInfo')
    .leftJoinAndSelect('account.organization', 'organization')
    .leftJoinAndSelect('organization.receiver', 'receiver')
    .leftJoinAndSelect('organization.donor', 'donor')
    .leftJoinAndSelect('account.volunteer', 'volunteer')
    .leftJoinAndMapMany('account.operationHours', 'account.operationHours', 'operationHours')
}

function _genWhereCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
  myAccount: Account
): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'account', filters, ['id', 'username', 'accountType']);
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'contactInfo', filters, ['email']);
  const orgNameFilt = { name: filters.organizationName };
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'organization', orgNameFilt, ['name'], { convertToLowerCase: true });
  const volunteerNameFilt = { lastName: filters.volunteerLastName, firstName: filters.volunteerFirstName };
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'volunteer', volunteerNameFilt, ['lastName', 'firstName'], { convertToLowerCase: true });
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'receiver', filters, ['autoReceiver']);
  queryBuilder = _genOperationHoursCondition(queryBuilder, filters);
  queryBuilder = _genDistanceCondition(queryBuilder, filters, myAccount);
  queryBuilder = _genFullTextCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genOperationHoursCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
): OrmSelectQueryBuilder<AccountEntity> {
  // Check for any overlap (invert condition where op hours are completely after or before donation window).
  if (filters.operationHoursWeekday || filters.operationHoursStartTime || filters.operationHoursEndTime) {
    let operationHoursCondition = '';
    let operationHoursBindings: Partial<OperationHours> = {};

    if (filters.operationHoursWeekday) {
      operationHoursCondition += 'operationHours.weekday = :weekday ';
      operationHoursBindings.weekday = filters.operationHoursWeekday;
    }
    if (filters.operationHoursStartTime) {
      operationHoursCondition += 'AND operationHours.endTime > :startTime '
      operationHoursBindings.startTime = filters.operationHoursStartTime;
    }
    if (filters.operationHoursEndTime) {
      operationHoursCondition += 'AND operationHours.startTime < :endTime '
      operationHoursBindings.endTime = filters.operationHoursEndTime;
    }
    operationHoursCondition = operationHoursCondition.replace(/^AND/, '').trim();

    queryBuilder = queryBuilder.andWhere(`(
      operationHours.weekday IS NULL
      OR (${operationHoursCondition})
    )`, operationHoursBindings);
  }
  return queryBuilder;
}

function _genDistanceCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
  myAccount: Account
): OrmSelectQueryBuilder<AccountEntity> {
  if (filters.distanceRangeMi != null) {
    if (!myAccount) { throw new LoginRequiredError(); }
    queryBuilder = queryBuilder.andWhere(
      'ST_DWithin(ST_MakePoint(:lon, :lat), contactInfo.location, :dist)',
      {
        // Either take explicit lon, lat coordinates from supplied filters, or derive from invoking user's account.
        lon: (filters.lon ? filters.lon : myAccount.contactInfo.location.coordinates[0]),
        lat: (filters.lat ? filters.lat : myAccount.contactInfo.location.coordinates[1]),
        dist: (filters.distanceRangeMi * 1609.34)
      }
    );
  }
  return queryBuilder;
}

function _genFullTextCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters)
: OrmSelectQueryBuilder<AccountEntity> {
  if (filters.fullTextQuery?.trim()) {
    const fullTextQuery: string = preprocessFullTextQuery(filters.fullTextQuery);
    queryBuilder = queryBuilder.andWhere('TO_TSQUERY(:fullTextQuery) @@ fullTextSearch.fullText', { fullTextQuery });
  }
  return queryBuilder;
}

function _genOrdering(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  sortOpts: SortOptions<AccountSortBy>
): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = _orderByQueryArg(queryBuilder, sortOpts);
  queryBuilder = _orderByDefault(queryBuilder, sortOpts);
  return queryBuilder;
}

function _orderByQueryArg(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  sortOpts: SortOptions<AccountSortBy>
): OrmSelectQueryBuilder<AccountEntity> {
  const sortOrder: 'ASC' | 'DESC' = sortOpts.sortOrder ? sortOpts.sortOrder : 'DESC';
  if (sortOpts.sortBy) {
    if (sortOpts.sortBy === 'email') {
      queryBuilder.addOrderBy(`contactInfo.email`, sortOrder);
    } else if (sortOpts.sortBy === 'name') {
      queryBuilder.addOrderBy('organization.name', sortOrder)
                  .addOrderBy('volunteer.lastName', sortOrder)
                  .addOrderBy('volunteer.firstName', sortOrder);
    } else {
      queryBuilder.addOrderBy(`account.${sortOpts.sortBy}`, sortOrder);
    }
  }
  return queryBuilder;
}

function _orderByDefault(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  sortOpts: SortOptions<AccountSortBy>
): OrmSelectQueryBuilder<AccountEntity> {
  if (sortOpts.sortBy !== 'name') {
    queryBuilder
      .addOrderBy('organization.name', 'ASC')
      .addOrderBy('volunteer.lastName', 'ASC')
      .addOrderBy('volunteer.firstName', 'ASC');
  }
  return queryBuilder;
}

function _postProcessAccounts(accounts: AccountEntity[], myAccount: Account, fullAccount?: boolean): void {
  accounts.forEach((account: AccountEntity) => {
    const isMyAccount: boolean = _accountHelper.doesAccountIdMatch(myAccount, account.id);
    fullAccount = (fullAccount || isMyAccount);
    _delVolunteerAddrIfNotMyAccount(account, fullAccount);
    _setVerifiedIfMyAccount(account, isMyAccount, myAccount);
  });
}

function _delVolunteerAddrIfNotMyAccount(account: AccountEntity, fullAccount: boolean): void {
  if (account.accountType === 'Volunteer' && !fullAccount) {
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
