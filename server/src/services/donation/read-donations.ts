import { AccountEntity } from '../../entity/account.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { getOrmRepository, OrmRepository, OrmSelectQueryBuilder } from '../../helpers/database/orm';
import { genPagination, genSimpleWhereConditions, QueryMod, QueryResult } from '../../helpers/database/query-builder-helper';
import { DonationFilters } from '../../interfaces/donation/donation-filters';
import { DonationReadRequest, DonationSortBy, DonationStatus, SortOptions } from '../../shared';

export async function readDonation(id: number, donationRepo?: OrmRepository<DonationEntity>): Promise<DonationEntity> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const queryResult: QueryResult<DonationEntity> = await readDonations(readRequest, donationRepo);
  return queryResult.entities[0];
}

export function readMyDonations(request: DonationReadRequest, myAccount: AccountEntity): Promise<QueryResult<DonationEntity>> {
  _fillMyAccountRequestFilter(request, myAccount);
  return readDonations(request);
}

function _fillMyAccountRequestFilter(request: DonationReadRequest, myAccount: AccountEntity): void {
  // Ensure we don't have bad data in request filters.
  delete request.donorAccountId;
  delete request.receiverAccountId;
  delete request.delivererAccountId;

  request.myDonations = true;
  switch (myAccount.accountType) {
    case 'Donor':     request.donorAccountId = myAccount.id;      break;
    case 'Receiver':  request.receiverAccountId = myAccount.id;   break;
    case 'Volunteer': request.delivererAccountId = myAccount.id;  break;
  }
  // Else, 'Admin' account type owns all accounts.
}

export function readDonations(
  request: DonationReadRequest,
  donationRepo: OrmRepository<DonationEntity> = getOrmRepository(DonationEntity)
): Promise<QueryResult<DonationEntity>> {
  const queryBuilder: OrmSelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  return _execDonationQuery(queryBuilder);
}

export function queryDonations(request: DonationReadRequest): QueryMod<DonationEntity> {
  const donationRepo: OrmRepository<DonationEntity> = getOrmRepository(DonationEntity);
  const queryBuilder: OrmSelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  return new QueryMod<DonationEntity>(
    queryBuilder,
    () => _execDonationQuery(queryBuilder)
  );
}

async function _execDonationQuery(queryBuilder: OrmSelectQueryBuilder<DonationEntity>): Promise<QueryResult<DonationEntity>> {
  const [donations, totalCount]: [DonationEntity[], number] = await queryBuilder.getManyAndCount();
  return { entities: donations, totalCount };
}

function _buildQuery(donationRepo: OrmRepository<DonationEntity>, request: DonationReadRequest): OrmSelectQueryBuilder<DonationEntity> {
  let queryBuilder: OrmSelectQueryBuilder<DonationEntity> = donationRepo.createQueryBuilder('donation');
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genWhereCondition(queryBuilder, request);
  queryBuilder = _genOrdering(queryBuilder, request);
  queryBuilder = genPagination(queryBuilder, request);
  return queryBuilder;
}

function _genJoins(queryBuilder: OrmSelectQueryBuilder<DonationEntity>): OrmSelectQueryBuilder<DonationEntity> {
  return queryBuilder
    .innerJoinAndSelect('donation.donorAccount', 'donorAccount')
    .innerJoinAndSelect('donorAccount.organization', 'donorOrganization')
    .innerJoinAndSelect('donorOrganization.donor', 'donor')
    .innerJoinAndSelect('donorAccount.contactInfo', 'donorContactInfo')
    .leftJoinAndSelect('donation.donorContactOverride', 'donorContactOverride')
    .leftJoinAndSelect('donation.claim', 'claim')
    .leftJoinAndSelect('claim.routeToReceiver', 'routeToReceiver')
    .leftJoinAndSelect('claim.receiverAccount', 'receiverAccount')
    .leftJoinAndSelect('receiverAccount.organization', 'receiverOrganization')
    .leftJoinAndSelect('receiverAccount.contactInfo', 'receiverContactInfo')
    .leftJoinAndSelect('receiverOrganization.receiver', 'receiver')
    .leftJoinAndSelect('claim.delivery', 'delivery')
    .leftJoinAndSelect('delivery.volunteerAccount', 'delivererAccount')
    .leftJoinAndSelect('delivery.routeToDonor', 'routeToDonor')
    .leftJoinAndSelect('delivererAccount.volunteer', 'delivererVolunteer')
    .leftJoinAndSelect('delivererAccount.contactInfo', 'delivererContactInfo');
}

function _genWhereCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['id', 'donationType', 'donationStatus'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', filters, simpleDonationWhereProps);
  queryBuilder = _genAccountConditions(queryBuilder, filters);
  queryBuilder = _genDeliveryWindowConditions(queryBuilder, filters);
  queryBuilder = _genDonationExpiredCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genAccountConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genDonorConditions(queryBuilder, filters);
  queryBuilder = _genReceiverConditions(queryBuilder, filters);
  queryBuilder = _genVolunteerConditions(queryBuilder, filters);
  return queryBuilder;
}

function _genDonorConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genDonorAccountIdCondition(queryBuilder, filters);
  queryBuilder = _genDonorNameCondition(queryBuilder, filters);
  queryBuilder = _genDonorOrgNameCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genDonorAccountIdCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.donorAccountId != null) {
    queryBuilder = queryBuilder.andWhere('donorAccount.id = :donorId', { donorId: filters.donorAccountId });
  }
  return queryBuilder;
}

function _genDonorNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['donorLastName', 'donorFirstName'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', filters, simpleDonationWhereProps, { convertToLowerCase: true });
  return queryBuilder;
}

function _genDonorOrgNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  filters.donorOrganizationName = filters.donorOrganizationName?.trim();
  if (filters.donorOrganizationName) {
    queryBuilder = queryBuilder.andWhere(
      'LOWER(donorOrganization.name) = :donorOrganizationName',
      { donorOrganizationName: filters.donorOrganizationName.toLowerCase() }
    );
  }
  return queryBuilder;
}

function _genReceiverConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genReceiverAccountIdCondition(queryBuilder, filters);
  queryBuilder = _genReceiverOrgNameCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genReceiverAccountIdCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.receiverAccountId != null) {
    queryBuilder = queryBuilder.andWhere('receiverAccount.id = :receiverId', { receiverId: filters.receiverAccountId });
  }
  return queryBuilder;
}

function _genReceiverOrgNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  filters.receiverOrganizationName = filters.receiverOrganizationName?.trim();
  if (filters.receiverOrganizationName) {
    queryBuilder = queryBuilder.andWhere(
      'LOWER(receiverOrganization.name) = :receiverOrganizationName',
      { receiverOrganizationName: filters.receiverOrganizationName.toLowerCase() }
    );
  }
  return queryBuilder;
}

function _genVolunteerConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.delivererAccountId != null) {
    queryBuilder = queryBuilder.andWhere('delivererAccount.id = :delivererId', { delivererId: filters.delivererAccountId });
  }
  return queryBuilder;
}

function _genDeliveryWindowConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  // WARNING: This condition may slow down the query when we have a lot of records. Refactor in future if necessary!
  if (filters.deliveryWindowOverlapStart) {
    queryBuilder = queryBuilder.andWhere(
      ` (delivery.pickupWindowEnd >= :deliveryWindowOverlapStart)
        OR (delivery.id IS NULL AND donation.pickupWindowEnd >= :donationWindowOverlapStart)`,
      {
        deliveryWindowOverlapStart: filters.deliveryWindowOverlapStart,
        donationWindowOverlapStart: filters.deliveryWindowOverlapStart
      }
    );
  }
  if (filters.deliveryWindowOverlapEnd) {
    queryBuilder = queryBuilder.andWhere(
      ` (delivery.pickupWindowStart <= :deliveryWindowOverlapEnd)
        OR (delivery.id IS NULL AND donation.pickupWindowStart <= :donationWindowOverlapEnd)`,
      {
        deliveryWindowOverlapEnd: filters.deliveryWindowOverlapEnd,
        donationWindowOverlapEnd: filters.deliveryWindowOverlapEnd
      }
    );
  }
  return queryBuilder;
}

function _genDonationExpiredCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationFilters
): OrmSelectQueryBuilder<DonationEntity> {
  const expired: boolean = (filters.expired === 'true');
  if (!expired && !_isSearchingSpecificDonation(filters)) {
    // Only include non-expired donations: Pickup window has not passed or has been scheduled for delivery.
    queryBuilder = queryBuilder.andWhere(`(donation.pickupWindowEnd > NOW() OR donation.donationStatus >= '${DonationStatus.Scheduled}')`);
  }
  return queryBuilder;
}

function _isSearchingSpecificDonation(filters: DonationFilters): boolean {
  return (filters.id != null);
}

function _genOrdering(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: SortOptions<DonationSortBy>
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _orderByCompleteLast(queryBuilder, sortOpts);
  queryBuilder = _orderByQueryArg(queryBuilder, sortOpts);
  queryBuilder = _orderByDefault(queryBuilder, sortOpts);
  return queryBuilder;
}

function _orderByCompleteLast(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: SortOptions<DonationSortBy>
): OrmSelectQueryBuilder<DonationEntity> {
  if (sortOpts.sortBy !== 'donationStatus') {
    queryBuilder.addOrderBy(`donation.complete`);
  }
  return queryBuilder;
}

function _orderByQueryArg(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: SortOptions<DonationSortBy>
): OrmSelectQueryBuilder<DonationEntity> {
  const sortOrder: 'ASC' | 'DESC' = sortOpts.sortOrder ? sortOpts.sortOrder : 'DESC';
  if (sortOpts.sortBy) {
    if (sortOpts.sortBy === 'donorOrganizationName') {
      queryBuilder.addOrderBy(`donorOrganization.name`, sortOrder);
    } else if (sortOpts.sortBy === 'receiverOrganizationName') {
      queryBuilder.addOrderBy(`receiverOrganization.name`, sortOrder);
    } else {
      queryBuilder.addOrderBy(`donation.${sortOpts.sortBy}`, sortOrder);
    }
  }
  return queryBuilder;
}

function _orderByDefault(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: SortOptions<DonationSortBy>
): OrmSelectQueryBuilder<DonationEntity> {
  // Always include donation pickup/delivery window ordering.
  if (sortOpts.sortBy !== 'deliveryWindowStart') {
    queryBuilder = queryBuilder.addOrderBy('donation.pickupWindowStart', sortOpts.sortOrder);
  }
  return queryBuilder;
}
