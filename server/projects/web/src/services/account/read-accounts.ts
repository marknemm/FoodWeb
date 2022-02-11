import { SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '~entity';
import { addPagination, addWhere, getOrmRepository, OrmSelectQueryBuilder, preprocessFullTextQuery, QueryMod } from '~orm';
import { Account, AccountHelper, AccountReadRequest, ListResponse, OperationHours } from '~shared';
import { LoginRequiredError } from '~web/helpers/response/foodweb-error';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

const _accountHelper = new AccountHelper();

export function readAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  return _readAccount(idOrUsername, myAccount, false);
}

export function readAccounts(request: AccountReadRequest, myAccount: Account): ListResponsePromise<AccountEntity> {
  return _readAccounts(request, myAccount, false);
}

export function readFullAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  return _readAccount(idOrUsername, myAccount, true);
}

export function readFullAccounts(request: AccountReadRequest, myAccount: Account): ListResponsePromise<AccountEntity> {
  return _readAccounts(request, myAccount, true);
}

/**
 * Adds default account associations with a given account alias to a given select query builder.
 * (e.g. Account, ContactInfo, Organization, Volunteer)
 * @param queryBuilder The query builder that the account associates will be added to.
 * @param joinField The join field that will be used to reference the account relation.
 * @param accountAlias The alias that shall be used for the account relation.
 * The alias will also be used for contactInfo, organization, and volunteer relations.
 * For example if given the alias receiverAccount, then receiverContactInfo, receiverOrganization,
 * and receiverVolunteer will be used for the other relations.
 * @param noSelect An optional boolean, which when set true, causes this to add account joins/associations
 * without adding the joined data to the select clause.
 * @return The input select query builder with account joins/associations added.
 */
export function addDefaultAccountAssociations<T>(
  queryBuilder: SelectQueryBuilder<T>,
  joinField: string,
  accountAlias: string,
  noSelect = false
): SelectQueryBuilder<T> {
  const aliasBase: string = accountAlias.replace('Account', '');
  if (noSelect) {
    queryBuilder.leftJoin(joinField, accountAlias);
    queryBuilder.leftJoin(`${accountAlias}.contactInfo`, `${aliasBase}ContactInfo`);
    queryBuilder.leftJoin(`${accountAlias}.organization`, `${aliasBase}Organization`);
    queryBuilder.leftJoin(`${accountAlias}.volunteer`, `${aliasBase}Volunteer`);
  } else {
    queryBuilder.leftJoinAndSelect(joinField, accountAlias);
    queryBuilder.leftJoinAndSelect(`${accountAlias}.contactInfo`, `${aliasBase}ContactInfo`);
    queryBuilder.leftJoinAndSelect(`${accountAlias}.organization`, `${aliasBase}Organization`);
    queryBuilder.leftJoinAndSelect(`${accountAlias}.volunteer`, `${aliasBase}Volunteer`);
  }
  return queryBuilder;
}

export function queryAccounts(request: AccountReadRequest, myAccount?: Account): QueryMod<AccountEntity> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return new QueryMod<AccountEntity>(
    queryBuilder,
    () => _execAccountQuery(queryBuilder, myAccount, false, request)
  );
}

export function queryFullAccounts(request: AccountReadRequest, myAccount?: Account): QueryMod<AccountEntity> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return new QueryMod<AccountEntity>(
    queryBuilder,
    () => _execAccountQuery(queryBuilder, myAccount, true, request)
  );
}

async function _readAccount(idOrUsername: number | string, myAccount: Account, fullAccount: boolean): Promise<AccountEntity> {
  const readRequest: AccountReadRequest = { page: 1, limit: 1 };
  (typeof idOrUsername === 'number')
    ? readRequest.id = idOrUsername
    : readRequest.username = idOrUsername;
  const listRes: ListResponse<AccountEntity> = await _readAccounts(readRequest, myAccount, fullAccount);
  return listRes.list[0];
}

function _readAccounts(request: AccountReadRequest, myAccount: Account, fullAccount: boolean): ListResponsePromise<AccountEntity> {
  const queryBuilder: OrmSelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  return _execAccountQuery(queryBuilder, myAccount, fullAccount, request);
}

async function _execAccountQuery(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  myAccount: Account,
  fullAccount: boolean,
  request: AccountReadRequest
): ListResponsePromise<AccountEntity> {
  const [accounts, totalCount]: [AccountEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessAccounts(accounts, myAccount, fullAccount);
  return genListResponse(accounts, totalCount, request);
}

function _buildQuery(request: AccountReadRequest, myAccount: Account): OrmSelectQueryBuilder<AccountEntity> {
  let queryBuilder: OrmSelectQueryBuilder<AccountEntity> = getOrmRepository(AccountEntity).createQueryBuilder('account');
  queryBuilder = _addAssociations(queryBuilder);
  queryBuilder = _addFilters(queryBuilder, request, myAccount);
  queryBuilder = _addOrdering(queryBuilder, request);
  queryBuilder = addPagination(queryBuilder, request);
  return queryBuilder;
}

function _addAssociations(queryBuilder: OrmSelectQueryBuilder<AccountEntity>): OrmSelectQueryBuilder<AccountEntity> {
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
    .leftJoinAndMapMany('account.operationHours', 'account.operationHours', 'operationHours');
}

function _addFilters(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadRequest,
  myAccount: Account
): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = addWhere(queryBuilder, 'account', filters, ['id', 'username', 'accountType']);
  queryBuilder = addWhere(queryBuilder, 'contactInfo', filters, ['email']);
  const orgNameFilt = { name: filters.organizationName };
  queryBuilder = addWhere(queryBuilder, 'organization', orgNameFilt, ['name'], { convertToLowerCase: true });
  const volunteerNameFilt = { lastName: filters.volunteerLastName, firstName: filters.volunteerFirstName };
  queryBuilder = addWhere(queryBuilder, 'volunteer', volunteerNameFilt, ['lastName', 'firstName'], { convertToLowerCase: true });
  queryBuilder = addWhere(queryBuilder, 'receiver', filters, ['autoReceiver']);
  queryBuilder = _addOperationHoursCondition(queryBuilder, filters);
  queryBuilder = _addDistanceCondition(queryBuilder, filters, myAccount);
  queryBuilder = _addFullTextCondition(queryBuilder, filters);
  return queryBuilder;
}

function _addOperationHoursCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadRequest,
): OrmSelectQueryBuilder<AccountEntity> {
  // Check for any overlap (invert condition where op hours are completely after or before donation window).
  if (filters.operationHoursWeekday || filters.operationHoursStartTime || filters.operationHoursEndTime) {
    let operationHoursCondition = '';
    const operationHoursBindings: Partial<OperationHours> = {};

    if (filters.operationHoursWeekday) {
      operationHoursCondition += 'operationHours.weekday = :weekday ';
      operationHoursBindings.weekday = filters.operationHoursWeekday;
    }
    if (filters.operationHoursStartTime) {
      operationHoursCondition += 'AND operationHours.endTime > :startTime ';
      operationHoursBindings.startTime = filters.operationHoursStartTime;
    }
    if (filters.operationHoursEndTime) {
      operationHoursCondition += 'AND operationHours.startTime < :endTime ';
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

function _addDistanceCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadRequest,
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

function _addFullTextCondition(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  filters: AccountReadRequest)
: OrmSelectQueryBuilder<AccountEntity> {
  if (filters.fullTextQuery?.trim()) {
    const fullTextQuery: string = preprocessFullTextQuery(filters.fullTextQuery);
    queryBuilder = queryBuilder.andWhere('TO_TSQUERY(:fullTextQuery) @@ fullTextSearch.fullText', { fullTextQuery });
  }
  return queryBuilder;
}

function _addOrdering(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  sortOpts: AccountReadRequest
): OrmSelectQueryBuilder<AccountEntity> {
  queryBuilder = _orderByQueryArg(queryBuilder, sortOpts);
  queryBuilder = _orderByDefault(queryBuilder, sortOpts);
  return queryBuilder;
}

function _orderByQueryArg(
  queryBuilder: OrmSelectQueryBuilder<AccountEntity>,
  sortOpts: AccountReadRequest
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
  sortOpts: AccountReadRequest
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
    if (isMyAccount) {
      account.verified = myAccount.verified;
    }
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
