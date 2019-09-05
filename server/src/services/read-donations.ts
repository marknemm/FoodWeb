import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { genSimpleWhereConditions, genPagination } from '../helpers/query-builder-helper';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';
import { DonationReadRequest, DonationReadFilters } from '../../../shared/src/interfaces/donation/donation-read-request';
import { Validation } from '../../../shared/src/constants/validation';

export interface DonationsQueryResult {
  donations: DonationEntity[];
  totalCount: number;
}

const _opHoursHelper = new OperationHoursHelper();

export async function readDonation(id: number, myAccount: AccountEntity, donationRepo?: Repository<DonationEntity>): Promise<DonationEntity> {
  const readRequest: DonationReadRequest = { id, page: 1, limit: 1 };
  const queryResult: DonationsQueryResult = await readDonations(readRequest, myAccount, donationRepo);
  return queryResult.donations[0];
}

export function readMyDonations(request: DonationReadRequest, myAccount: AccountEntity): Promise<DonationsQueryResult> {
  _fillMyAccountRequestFilter(request, myAccount);
  return readDonations(request, myAccount);
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
  myAccount: AccountEntity,
  donationRepo: Repository<DonationEntity> = getRepository(DonationEntity)
): Promise<DonationsQueryResult> {
  const queryBuilder: SelectQueryBuilder<DonationEntity> = _buildQuery(donationRepo, request);
  const [donations, totalCount]: [DonationEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessDonations(donations, myAccount);
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
    .innerJoinAndSelect('donorAccount.contactInfo', 'donorContactInfo')
    .leftJoinAndMapMany('donorAccount.operationHours', 'donorAccount.operationHours', 'donorOpHours')
    .leftJoinAndSelect('donation.receiverAccount', 'receiverAccount')
    .leftJoinAndSelect('receiverAccount.organization', 'receiverOrganization')
    .leftJoinAndSelect('receiverAccount.contactInfo', 'receiverContactInfo')
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
  // Always include donated date (ID) ordering. Default to ASC to view oldest donations first in donation/delivery search.
  // Default to DESC to view latest donations first in 'my donations/deliveries' search.
  if (request.sortDonatedDate && Validation.SORT_REGEX.test(request.sortDonatedDate)) {
    const order = <'ASC' | 'DESC'> request.sortDonatedDate.toUpperCase();
    queryBuilder.addOrderBy('donation.id', order);
  } else if (request.donorAccountId != null || request.receiverAccountId != null || request.delivererAccountId != null) {
    queryBuilder.addOrderBy('donation.id', 'DESC');
  } else {
    queryBuilder.addOrderBy('donation.id', 'ASC');
  }
  return queryBuilder;
}

function _postProcessDonations(donations: DonationEntity[], myAccount: AccountEntity): void {
  donations.forEach((donation: DonationEntity) => {
    _formatAccountOperationHours(donation);
    _setVerifyFlagIfMyAccount(donation, myAccount);
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

function _setVerifyFlagIfMyAccount(donation: DonationEntity, myAccount: AccountEntity): void {
  if (myAccount) {
    if (donation.donorAccount.id === myAccount.id) {
      donation.donorAccount.verified = myAccount.verified;
    } else if (donation.receiverAccount && donation.receiverAccount.id === myAccount.id) {
      donation.receiverAccount.verified = myAccount.verified;
    } else if (donation.delivery && donation.delivery.volunteerAccount.id === myAccount.id) {
      donation.delivery.volunteerAccount.verified = myAccount.verified;
    }
  }
}
