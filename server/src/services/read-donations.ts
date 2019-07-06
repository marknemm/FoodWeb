import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { DonationReadRequest, DonationReadFilters } from '../../../shared/src/interfaces/donation/donation-read-request';
import { PagingParams } from '../../../shared/src/interfaces/paging-params';
import { DonationReadSort } from '../../../shared/src/interfaces/donation/donation-read-sort';
import { Validation } from '../../../shared/src/constants/validation';

export interface DonationsQueryResult {
  donations: Donation[];
  totalCount: number;
}

const _opHoursHelper = new OperationHoursHelper();

export async function readDonation(id: number, myAccount: AccountEntity, donationRepo?: Repository<DonationEntity>): Promise<Donation> {
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
  let queryBuilder: SelectQueryBuilder<DonationEntity> = donationRepo.createQueryBuilder('donation')
  queryBuilder = _genJoins(queryBuilder);
  queryBuilder = _genWhereCondition(queryBuilder, request);
  queryBuilder = _genOrdering(queryBuilder, request);
  queryBuilder = _genPagination(queryBuilder, request);

  const [donations, totalCount]: [DonationEntity[], number] = await queryBuilder.getManyAndCount();
  _postProcessDonations(donations, myAccount);
  return { donations, totalCount };
}

function _genJoins(queryBuilder: SelectQueryBuilder<DonationEntity>): SelectQueryBuilder<DonationEntity> {
  return queryBuilder
    .innerJoinAndSelect('donation.donorAccount', 'donorAccount')
    .innerJoinAndSelect('donorAccount.organization', 'donorOrganization')
    .innerJoinAndSelect('donorAccount.contactInfo', 'donorContactInfo')
    .innerJoinAndMapMany('donorAccount.operationHours', 'donorAccount.operationHours', 'donorOpHours')
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
  queryBuilder = _genDonationIdCondition(queryBuilder, filters);
  queryBuilder = _genDonationTypeCondition(queryBuilder, filters);
  queryBuilder = _genDonationStatusCondition(queryBuilder, filters);
  queryBuilder = _genAccountConditions(queryBuilder, filters);
  queryBuilder = _genDonorNameConditions(queryBuilder, filters);
  return queryBuilder;
}

function _genDonationIdCondition(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.id) {
    queryBuilder = queryBuilder.andWhere('donation.id = :id', { id: filters.id });
  }
  return queryBuilder;
}

function _genDonationTypeCondition(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.donationType) {
    queryBuilder = (filters.donationType.indexOf(',') >= 0)
      ? queryBuilder.andWhere('donation.donationType IN (:...donationTypes)', { donationTypes: filters.donationType.split(',') })
      : queryBuilder.andWhere('donation.donationType = :donationType', { donationType: filters.donationType });
  }
  return queryBuilder;
}

function _genDonationStatusCondition(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.donationStatus) {
    queryBuilder = (filters.donationStatus.indexOf(',') >= 0)
      ? queryBuilder.andWhere('donation.donationStatus IN (:...donationStatuses)', { donationStatuses: filters.donationStatus.split(',') })
      : queryBuilder.andWhere('donation.donationStatus = :donationStatus', { donationStatus: filters.donationStatus });
  }
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

function _genDonorNameConditions(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  filters: DonationReadFilters
): SelectQueryBuilder<DonationEntity> {
  if (filters.donorLastName) {
    queryBuilder = queryBuilder.andWhere('donation.donorLastName = :lastName', { lastName: filters.donorLastName });
  }
  if (filters.donorFirstName) {
    queryBuilder = queryBuilder.andWhere('donation.donorFirstName = :firstName', { firstName: filters.donorFirstName });
  }
  return queryBuilder;
}

function _genOrdering(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  sortOrder: DonationReadSort
): SelectQueryBuilder<DonationEntity> {
  if (sortOrder.sortDonorOrganization && Validation.SORT_REGEX.test(sortOrder.sortDonorOrganization)) {
    const order = <'ASC' | 'DESC'> sortOrder.sortDonorOrganization.toUpperCase();
    queryBuilder = queryBuilder.addOrderBy('donorOrganization.organizationName', order);
  }
  if (sortOrder.sortDonationStatus && Validation.SORT_REGEX.test(sortOrder.sortDonationStatus)) {
    const order = <'ASC' | 'DESC'> sortOrder.sortDonationStatus.toUpperCase();
    queryBuilder = queryBuilder.addOrderBy('donation.donationStatus', order);
  }
  // Always include donated date (ID) ordering. Default to ASC to view oldest donations first.
  if (sortOrder.sortDonatedDate && Validation.SORT_REGEX.test(sortOrder.sortDonatedDate)) {
    const order = <'ASC' | 'DESC'> sortOrder.sortDonatedDate.toUpperCase();
    queryBuilder.addOrderBy('donation.id', order);
  } else {
    queryBuilder.addOrderBy('donation.id', 'ASC');
  }
  return queryBuilder;
}

function _genPagination(
  queryBuilder: SelectQueryBuilder<DonationEntity>,
  pagingParams: PagingParams
): SelectQueryBuilder<DonationEntity> {
  if (!pagingParams.page) { pagingParams.page = 1 };
  if (!pagingParams.limit) { pagingParams.limit = 10 };
  return queryBuilder
    .skip((pagingParams.page - 1) * pagingParams.limit)
    .take(pagingParams.limit);
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
