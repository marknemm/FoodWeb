import { getRepository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { LoginRequiredError } from '../helpers/food-web-error';
import { genSimpleWhereConditions, genPagination } from '../helpers/query-builder-helper';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';
import { Account, OperationHours } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest, AccountReadFilters, AccountReadSort } from '../../../shared/src/interfaces/account/account-read-request';
import { AccountHelper } from '../../../shared/src/helpers/account-helper';
import { DonationEntity } from '../entity/donation.entity';

export interface AccountsQueryResult {
  accounts: AccountEntity[];
  totalCount: number;
}

const _accountHelper = new AccountHelper();
const _opHoursHelper = new OperationHoursHelper();

export async function readAccount(idOrUsername: number | string, myAccount?: Account): Promise<AccountEntity> {
  let readRequest: AccountReadRequest = { page: 1, limit: 1 };
  (typeof idOrUsername === 'number')
    ? readRequest.id = idOrUsername
    : readRequest.username = idOrUsername;
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, myAccount);
  return queryResult.accounts[0];
}

export async function readAccounts(request: AccountReadRequest, myAccount: Account): Promise<AccountsQueryResult> {
  const queryBuilder: SelectQueryBuilder<AccountEntity> = _buildQuery(request, myAccount);
  const [accounts, totalCount]: [AccountEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessAccounts(accounts, myAccount);
  return { accounts, totalCount };
}

function _buildQuery(request: AccountReadRequest, myAccount: Account): SelectQueryBuilder<AccountEntity> {
  let queryBuilder: SelectQueryBuilder<AccountEntity> = getRepository(AccountEntity).createQueryBuilder('account');
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genWhereCondition(queryBuilder, request, myAccount);
  queryBuilder = _genOrdering(queryBuilder, request);
  queryBuilder = genPagination(queryBuilder, request);
  return queryBuilder;
}

function _genJoins(queryBuilder: SelectQueryBuilder<AccountEntity>): SelectQueryBuilder<AccountEntity> {
  return queryBuilder
    .innerJoinAndSelect('account.contactInfo', 'contactInfo')
    .leftJoinAndSelect('account.organization', 'organization')
    .leftJoinAndSelect('organization.receiver', 'receiver')
    .leftJoinAndSelect('organization.donor', 'donor')
    .leftJoinAndSelect('account.volunteer', 'volunteer')
    .leftJoinAndMapMany('account.operationHours', 'account.operationHours', 'operationHours')
}

function _genWhereCondition(
  queryBuilder: SelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
  myAccount: Account
): SelectQueryBuilder<AccountEntity> {
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'account', filters, ['id', 'username', 'accountType']);
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'contactInfo', filters, ['email']);
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'organization', filters, ['organizationName']);
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'receiver', filters, ['autoReceiver']);
  queryBuilder = _genOperationHoursCondition(queryBuilder, filters, myAccount);
  queryBuilder = _genDistanceCondition(queryBuilder, filters, myAccount);
  return queryBuilder;
}

function _genOperationHoursCondition(
  queryBuilder: SelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
  myAccount: Account
): SelectQueryBuilder<AccountEntity> {
  if (filters.operationHoursRange) {
    if (!myAccount) { throw new LoginRequiredError(); }
    const operationHours: OperationHours = _opHoursHelper.dateTimeRangeToOperationHours(
      filters.operationHoursRange,
      myAccount.contactInfo.timezone
    );
    // Check for any overlap (invert condition where op hours are completely after or before donation window).
    queryBuilder = queryBuilder.andWhere(`
      (
        operationHours.weekday IS NULL
        OR (
          operationHours.weekday = :weekday
          AND NOT (
            operationHours.startTime >= :endTime
            OR operationHours.endTime <= :startTime
          )
        )
      )`,
      operationHours
    );
  }
  return queryBuilder;
}

function _genDistanceCondition(
  queryBuilder: SelectQueryBuilder<AccountEntity>,
  filters: AccountReadFilters,
  myAccount: Account
): SelectQueryBuilder<AccountEntity> {
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

function _genOrdering(
  queryBuilder: SelectQueryBuilder<AccountEntity>,
  sort: AccountReadSort
): SelectQueryBuilder<AccountEntity> {


  return queryBuilder
    .addOrderBy('organization.organizationName', 'ASC')
    .addOrderBy('volunteer.lastName', 'ASC')
    .addOrderBy('volunteer.firstName', 'ASC')
}

function _postProcessAccounts(accounts: AccountEntity[], myAccount: Account): void {
  accounts.forEach((account: AccountEntity) => {
    const isMyAccount: boolean = _accountHelper.isMyAccount(myAccount, account.id);
    _opHoursHelper.formatOperationHoursTimes(account.operationHours);
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
