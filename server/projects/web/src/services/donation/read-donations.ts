import { AccountEntity, DonationEntity } from '~entity';
import { genPagination, genSimpleWhereConditions, getOrmRepository, OrmRepository, OrmSelectQueryBuilder, preprocessFullTextQuery, QueryMod } from '~orm';
import { DonationReadRequest, DonationStatus, ListResponse } from '~shared';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

export async function readDonation(id: number, donationRepo?: OrmRepository<DonationEntity>): Promise<DonationEntity> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const listRes: ListResponse<DonationEntity> = await readDonations(readRequest, donationRepo);
  return listRes.list[0];
}

export function readMyDonations(request: DonationReadRequest, myAccount: AccountEntity): ListResponsePromise<DonationEntity> {
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
): ListResponsePromise<DonationEntity> {
  const queryBuilder: OrmSelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  return _execDonationQuery(queryBuilder, request);
}

export function queryDonations(request: DonationReadRequest): QueryMod<DonationEntity> {
  const donationRepo: OrmRepository<DonationEntity> = getOrmRepository(DonationEntity);
  const queryBuilder: OrmSelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  return new QueryMod<DonationEntity>(
    queryBuilder,
    () => _execDonationQuery(queryBuilder, request)
  );
}

async function _execDonationQuery(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): ListResponsePromise<DonationEntity> {
  const [donations, totalCount]: [DonationEntity[], number] = await queryBuilder.getManyAndCount();
  return genListResponse(donations, totalCount, request);
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
    .innerJoin(
      'FullTextSearch', 'donationFullTextSearch',
      `donationFullTextSearch.entityId = donation.id AND donationFullTextSearch.entityTable = 'Donation'`
    )
    .innerJoinAndSelect('donation.donorAccount', 'donorAccount')
    .innerJoinAndSelect('donorAccount.organization', 'donorOrganization')
    .innerJoinAndSelect('donorOrganization.donor', 'donor')
    .innerJoinAndSelect('donorAccount.contactInfo', 'donorContactInfo')
    .innerJoin(
      'FullTextSearch', 'donorFullTextSearch',
      `donorFullTextSearch.entityId = donorAccount.id AND donorFullTextSearch.entityTable = 'Account'`
    )
    .leftJoinAndSelect('donation.donorContactOverride', 'donorContactOverride')
    .leftJoinAndSelect('donation.claim', 'claim')
    .leftJoinAndSelect('claim.routeToReceiver', 'routeToReceiver')
    .leftJoinAndSelect('claim.receiverAccount', 'receiverAccount')
    .leftJoin(
      'FullTextSearch', 'receiverFullTextSearch',
      `receiverFullTextSearch.entityId = receiverAccount.id AND receiverFullTextSearch.entityTable = 'Account'`
    )
    .leftJoinAndSelect('receiverAccount.organization', 'receiverOrganization')
    .leftJoinAndSelect('receiverAccount.contactInfo', 'receiverContactInfo')
    .leftJoinAndSelect('receiverOrganization.receiver', 'receiver')
    .leftJoinAndSelect('claim.delivery', 'delivery')
    .leftJoinAndSelect('delivery.volunteerAccount', 'delivererAccount')
    .leftJoin(
      'FullTextSearch', 'delivererFullTextSearch',
      `delivererFullTextSearch.entityId = delivererAccount.id AND delivererFullTextSearch.entityTable = 'Account'`
    )
    .leftJoinAndSelect('delivery.routeToDonor', 'routeToDonor')
    .leftJoinAndSelect('delivererAccount.volunteer', 'delivererVolunteer')
    .leftJoinAndSelect('delivererAccount.contactInfo', 'delivererContactInfo');
}

function _genWhereCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['id', 'donationType', 'donationStatus'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', filters, simpleDonationWhereProps);
  queryBuilder = _genAccountConditions(queryBuilder, filters);
  queryBuilder = _genDeliveryWindowConditions(queryBuilder, filters);
  queryBuilder = _genDonationExpiredCondition(queryBuilder, filters);
  queryBuilder = _genFullTextCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genAccountConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genDonorConditions(queryBuilder, filters);
  queryBuilder = _genReceiverConditions(queryBuilder, filters);
  queryBuilder = _genVolunteerConditions(queryBuilder, filters);
  return queryBuilder;
}

function _genDonorConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genDonorAccountIdCondition(queryBuilder, filters);
  queryBuilder = _genDonorNameCondition(queryBuilder, filters);
  queryBuilder = _genDonorOrgNameCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genDonorAccountIdCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.donorAccountId != null) {
    queryBuilder = queryBuilder.andWhere('donorAccount.id = :donorId', { donorId: filters.donorAccountId });
  }
  return queryBuilder;
}

function _genDonorNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['donorLastName', 'donorFirstName'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', filters, simpleDonationWhereProps, { convertToLowerCase: true });
  return queryBuilder;
}

function _genDonorOrgNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
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
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _genReceiverAccountIdCondition(queryBuilder, filters);
  queryBuilder = _genReceiverOrgNameCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genReceiverAccountIdCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.receiverAccountId != null) {
    queryBuilder = queryBuilder.andWhere('receiverAccount.id = :receiverId', { receiverId: filters.receiverAccountId });
  }
  return queryBuilder;
}

function _genReceiverOrgNameCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
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
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (filters.delivererAccountId != null) {
    queryBuilder = queryBuilder.andWhere('delivererAccount.id = :delivererId', { delivererId: filters.delivererAccountId });
  }
  return queryBuilder;
}

function _genDeliveryWindowConditions(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest
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
  filters: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  const expired: boolean = (filters.expired === 'true');
  if (!expired && filters.id == null) {
    // Only include non-expired donations: Pickup window has not passed or has been scheduled for delivery.
    queryBuilder = queryBuilder.andWhere(`(donation.pickupWindowEnd > NOW() OR donation.donationStatus >= '${DonationStatus.Scheduled}')`);
  }
  return queryBuilder;
}

function _genFullTextCondition(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  filters: DonationReadRequest)
: OrmSelectQueryBuilder<DonationEntity> {
  if (filters.fullTextQuery?.trim()) {
    const fullTextQuery: string = preprocessFullTextQuery(filters.fullTextQuery);
    // NOTE: This portion of filter clause may prove to be very inefficienc. Must keep an eye on this...
    queryBuilder = queryBuilder.andWhere(`(
      TO_TSQUERY(:fullTextQuery) @@ donationFullTextSearch.fullText
      OR TO_TSQUERY(:fullTextQuery) @@ donorFullTextSearch.fullText
      OR TO_TSQUERY(:fullTextQuery) @@ receiverFullTextSearch.fullText
      OR TO_TSQUERY(:fullTextQuery) @@ delivererFullTextSearch.fullText
    )`, { fullTextQuery });
  }
  return queryBuilder;
}

function _genOrdering(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  queryBuilder = _orderByCompleteLast(queryBuilder, sortOpts);
  queryBuilder = _orderByQueryArg(queryBuilder, sortOpts);
  queryBuilder = _orderByDefault(queryBuilder, sortOpts);
  return queryBuilder;
}

function _orderByCompleteLast(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  if (sortOpts.sortBy !== 'donationStatus') {
    queryBuilder.addOrderBy(`donation.complete`);
  }
  return queryBuilder;
}

function _orderByQueryArg(
  queryBuilder: OrmSelectQueryBuilder<DonationEntity>,
  sortOpts: DonationReadRequest
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
  sortOpts: DonationReadRequest
): OrmSelectQueryBuilder<DonationEntity> {
  // Always include donation pickup/delivery window ordering.
  if (sortOpts.sortBy !== 'deliveryWindowStart') {
    queryBuilder = queryBuilder.addOrderBy('donation.pickupWindowStart', sortOpts.sortOrder);
  }
  return queryBuilder;
}
