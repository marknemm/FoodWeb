import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { genSimpleWhereConditions, genPagination } from '../helpers/query-builder-helper';
import { OperationHoursHelper } from '../shared';
import { DonationReadRequest, DonationReadFilters } from '../shared';
import { Validation } from '../shared';

export interface DonationsQueryResult {
  donations: DonationEntity[];
  totalCount: number;
}

const _opHoursHelper = new OperationHoursHelper();

export async function readDonation(id: number, donationRepo?: Repository<DonationEntity>): Promise<DonationEntity> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const queryResult: DonationsQueryResult = await readDonations(readRequest, donationRepo);
  return queryResult.donations[0];
}

export function readMyDonations(request: DonationReadRequest, myAccount: AccountEntity): Promise<DonationsQueryResult> {
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

export async function readDonations(
  request: DonationReadRequest,
  donationRepo: Repository<DonationEntity> = getRepository(DonationEntity)
): Promise<DonationsQueryResult> {
  const queryBuilder: SelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  const [donations, totalCount]: [DonationEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessDonations(donations);
  return { donations, totalCount };
}

function _buildQuery(donationRepo: Repository<DonationEntity>, request: DonationReadRequest): SelectQueryBuilder<DonationEntity> {
  let queryBuilder: SelectQueryBuilder<DonationEntity> = donationRepo.createQueryBuilder('donation')
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genWhereCondition(queryBuilder, request);
  queryBuilder = _genOrdering(queryBuilder, request);
  queryBuilder = genPagination(queryBuilder, request);
  return queryBuilder;
}

function _genJoins(queryBuilder: SelectQueryBuilder<DonationEntity>): SelectQueryBuilder<DonationEntity> {
  return queryBuilder
    .innerJoinAndSelect('donation.donorAccount', 'donorAccount')
    .innerJoinAndSelect('donorAccount.organization', 'donorOrganization')
    .innerJoinAndSelect('donorOrganization.donor', 'donor')
    .innerJoinAndSelect('donorAccount.contactInfo', 'donorContactInfo')
    .innerJoinAndSelect('donation.donorContactOverride', 'donorContactOverride')
    .leftJoinAndMapMany('donorAccount.operationHours', 'donorAccount.operationHours', 'donorOpHours')
    .leftJoinAndSelect('donation.receiverAccount', 'receiverAccount')
    .leftJoinAndSelect('receiverAccount.organization', 'receiverOrganization')
    .leftJoinAndSelect('receiverAccount.contactInfo', 'receiverContactInfo')
    .leftJoinAndSelect('receiverOrganization.receiver', 'receiver')
    .leftJoinAndMapMany('receiverAccount.operationHours', 'receiverAccount.operationHours', 'receiverOpHours')
    .leftJoinAndSelect('donation.delivery', 'delivery')
    .leftJoinAndSelect('delivery.volunteerAccount', 'delivererAccount')
    .leftJoinAndSelect('delivererAccount.volunteer', 'delivererVolunteer')
    .leftJoinAndSelect('delivererAccount.contactInfo', 'delivererContactInfo');
}

function _genWhereCondition(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  const simpleDonationWhereProps = ['id', 'donationType', 'donationStatus', 'donorLastName', 'donorFirstName'];
  queryBuilder = genSimpleWhereConditions(queryBuilder, 'donation', filters, simpleDonationWhereProps);
  queryBuilder = _genAccountConditions(queryBuilder, filters);
  queryBuilder = _genDeliveryWindowConditions(queryBuilder, filters);
  queryBuilder = _genDonationExpiredCondition(queryBuilder, filters);
  return queryBuilder;
}

function _genAccountConditions(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.donorAccountId != null) {
    queryBuilder = queryBuilder.andWhere('donorAccount.id = :donorId', { donorId: filters.donorAccountId });
  }
  if (filters.receiverAccountId != null) {
    queryBuilder = queryBuilder.andWhere('receiverAccount.id = :receiverId', { receiverId: filters.receiverAccountId });
  }
  if (filters.delivererAccountId != null) {
    queryBuilder = queryBuilder.andWhere('delivererAccount.id = :delivererId', { delivererId: filters.delivererAccountId });
  }
  return queryBuilder;
}

function _genDeliveryWindowConditions(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.deliveryWindowOverlapStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowEnd >= :deliveryWindowOverlapStart',
      { deliveryWindowOverlapStart: filters.deliveryWindowOverlapStart }
    );
  }
  if (filters.deliveryWindowOverlapEnd) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart <= :deliveryWindowOverlapEnd',
      { deliveryWindowOverlapEnd: filters.deliveryWindowOverlapEnd }
    );
  }
  if (filters.earliestDeliveryWindowStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart >= :earliestDeliveryWindowStart',
      { earliestDeliveryWindowStart: filters.earliestDeliveryWindowStart }
    );
  }
  if (filters.latestDeliveryWindowStart) {
    queryBuilder = queryBuilder.andWhere(
      'delivery.pickupWindowStart <= :latestDeliveryWindowStart',
      { latestDeliveryWindowStart: filters.latestDeliveryWindowStart }
    );
  }
  if (filters.remainingTimeRatioUntilDelivery) {
    queryBuilder = queryBuilder.andWhere(`
      (
        EXTRACT(EPOCH FROM (now() - donation.createTimestamp))::DECIMAL
        / ABS(EXTRACT(EPOCH FROM (donation.pickupWindowStart - donation.createTimestamp)))::DECIMAL
      ) >= :elapsedTimeRatio
    `, { elapsedTimeRatio: (1 - filters.remainingTimeRatioUntilDelivery) });
  }
  return queryBuilder;
}

function _genDonationExpiredCondition(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
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
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  request: DonationReadRequest
): SelectQueryBuilder<DonationEntity> {
  if (request.sortDonorOrganization && Validation.SORT_REGEX.test(request.sortDonorOrganization)) {
    const order = <'ASC' | 'DESC'> request.sortDonorOrganization.toUpperCase();
    queryBuilder = queryBuilder.addOrderBy('donorOrganization.organizationName', order);
  }
  if (request.sortDonationStatus && Validation.SORT_REGEX.test(request.sortDonationStatus)) {
    const order = <'ASC' | 'DESC'> request.sortDonationStatus.toUpperCase();
    queryBuilder = queryBuilder.addOrderBy('donation.donationStatus', order);
  }

  // Sort by created date (equivalent to donation ID). If querying an account's donations, automatically sort in DESC order by default.
  const isMyDonations: boolean =
    (request.donorAccountId != null || request.receiverAccountId != null || request.delivererAccountId != null);
  if (isMyDonations && (!request.sortCreatedDate || !Validation.SORT_REGEX.test(request.sortCreatedDate))) {
    request.sortCreatedDate = 'DESC';
  }
  if (request.sortCreatedDate && Validation.SORT_REGEX.test(request.sortCreatedDate)) {
    const order = <'ASC' | 'DESC'> request.sortCreatedDate.toUpperCase();
    queryBuilder = queryBuilder.addOrderBy('donation.id', order);
  }

  // Always include donation pickup/delivery window ordering. Default to ASC to view oldest donations first in donation/delivery search.
  if (!request.sortPickupWindow || !Validation.SORT_REGEX.test(request.sortPickupWindow)) {
    request.sortPickupWindow = 'ASC';
  }
  const order = <'ASC' | 'DESC'> request.sortPickupWindow.toUpperCase();
  queryBuilder = _addOrderByPickupWindow(queryBuilder, order);

  return queryBuilder;
}

function _addOrderByPickupWindow(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  sortOrder: 'ASC' | 'DESC'
): SelectQueryBuilder<DonationEntity> {
  queryBuilder = queryBuilder.addOrderBy('delivery.pickupWindowStart', sortOrder);
  queryBuilder = queryBuilder.addOrderBy('donation.pickupWindowStart', sortOrder);
  return queryBuilder;
}

function _postProcessDonations(donations: DonationEntity[]): void {
  donations.forEach((donation: DonationEntity) => {
    _formatAccountOperationHours(donation);
  });
}

function _formatAccountOperationHours(donation: DonationEntity): void {
  _opHoursHelper.formatOperationHoursTimes(donation.donorAccount.operationHours);
  if (donation.receiverAccount) {
    _opHoursHelper.formatOperationHoursTimes(donation.receiverAccount.operationHours);
  }
  if (donation.delivery) {
    _opHoursHelper.formatOperationHoursTimes(donation.delivery.volunteerAccount.operationHours);
  }
}
