import { AccountEntity } from '../../entity/account.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { getOrmRepository, OrmRepository, OrmSelectQueryBuilder } from '../../helpers/database/orm';
import { genPagination, genSimpleWhereConditions, QueryMod, QueryResult } from '../../helpers/database/query-builder-helper';
import { DonationReadRequest, Validation } from '../../shared';

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
    case 'Donor':
      request.donorAccountId = myAccount.id;
      break;
    case 'Receiver':
      request.receiverAccountId = myAccount.id;
      break;
    case 'Volunteer':
      request.delivererAccountId = myAccount.id;
      break;
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
    .leftJoinAndMapMany('donorAccount.operationHours', 'donorAccount.operationHours', 'donorOpHours')
    .leftJoinAndSelect('donation.claim', 'claim')
    .leftJoinAndSelect('claim.routeToReceiver', 'routeToReceiver')
    .leftJoinAndSelect('claim.receiverAccount', 'receiverAccount')
    .leftJoinAndSelect('receiverAccount.organization', 'receiverOrganization')
    .leftJoinAndSelect('receiverAccount.contactInfo', 'receiverContactInfo')
    .leftJoinAndSelect('receiverOrganization.receiver', 'receiver')
    .leftJoinAndMapMany('receiverAccount.operationHours', 'receiverAccount.operationHours', 'receiverOpHours')
    .leftJoinAndSelect('claim.delivery', 'delivery')
    .leftJoinAndSelect('delivery.volunteerAccount', 'delivererAccount')
    .leftJoinAndSelect('delivery.routeToDonor', 'routeToDonor')
    .leftJoinAndSelect('delivererAccount.volunteer', 'delivererVolunteer')
    .leftJoinAndSelect('delivererAccount.contactInfo', 'delivererContactInfo');
}

function _genWhereCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['id', 'donationType', 'donationStatus', 'donorLastName', 'donorFirstName'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', request, simpleDonationWhereProps);
  queryBuilder = _genAccountConditions(queryBuilder, request);
  queryBuilder = _genDeliveryWindowConditions(queryBuilder, request);
  queryBuilder = _genDonationExpiredCondition(queryBuilder, request);
  return queryBuilder;
}

function _genAccountConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (request.donorAccountId != null) {
    queryBuilder = queryBuilder.andWhere('donorAccount.id = :donorId', { donorId: request.donorAccountId });
  }
  if (request.receiverAccountId != null) {
    queryBuilder = queryBuilder.andWhere('receiverAccount.id = :receiverId', { receiverId: request.receiverAccountId });
  }
  if (request.delivererAccountId != null) {
    queryBuilder = queryBuilder.andWhere('delivererAccount.id = :delivererId', { delivererId: request.delivererAccountId });
  }
  return queryBuilder;
}

function _genDeliveryWindowConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (request.deliveryWindowOverlapStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowEnd >= :deliveryWindowOverlapStart',
      { deliveryWindowOverlapStart: request.deliveryWindowOverlapStart }
    );
  }
  if (request.deliveryWindowOverlapEnd) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart <= :deliveryWindowOverlapEnd',
      { deliveryWindowOverlapEnd: request.deliveryWindowOverlapEnd }
    );
  }
  if (request.earliestDeliveryWindowStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart >= :earliestDeliveryWindowStart',
      { earliestDeliveryWindowStart: request.earliestDeliveryWindowStart }
    );
  }
  if (request.latestDeliveryWindowStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart <= :latestDeliveryWindowStart',
      { latestDeliveryWindowStart: request.latestDeliveryWindowStart }
    );
  }
  return queryBuilder;
}

function _genDonationExpiredCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const expired: boolean = (filters.expired === 'true');
  // If not looking for a specific donation, then filter out all donations that have expired (pickup window has passed).
  if (!expired && filters.id == null && !filters.myDonations) {
    queryBuilder = queryBuilder.andWhere(`(donation.pickupWindowEnd > NOW() OR donation.donationStatus >= 'Picked Up')`);
  } else if (expired) {
    queryBuilder = queryBuilder.andWhere('donation.pickupWindowEnd <= NOW()');
    queryBuilder = queryBuilder.andWhere(`donation.donationStatus < 'Picked Up'`);
  }
  return queryBuilder;
}

function _genOrdering(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const sortOrder: 'ASC' | 'DESC' = request.sortOrder ? request.sortOrder : 'DESC';
  if (request.sortBy) {
    if (request.sortBy === 'donorOrganizationName') {
      queryBuilder.addOrderBy(`donorOrganization.organizationName`, sortOrder);
    } else {
      queryBuilder.addOrderBy(`donation.${request.sortBy}`, sortOrder);
    }
  }

  // Always include donation pickup/delivery window ordering. Default to ASC to view oldest donations first in donation/delivery search.
  if (request.sortBy !== 'pickupWindowStart') {
    queryBuilder = _addOrderByPickupWindow(queryBuilder, 'ASC');
  }

  return queryBuilder;
}

function _addOrderByPickupWindow(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOrder: 'ASC' | 'DESC'
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = queryBuilder.addOrderBy('delivery.pickupWindowStart', sortOrder);
  queryBuilder = queryBuilder.addOrderBy('donation.pickupWindowStart', sortOrder);
  return queryBuilder;
}
