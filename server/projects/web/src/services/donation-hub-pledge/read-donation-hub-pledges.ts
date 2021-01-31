import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '~entity';
import { addPagination, addWhere } from '~orm';
import { DateTimeHelper, DonationHubPledge, DonationHubPledgeReadRequest, ListResponse } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { addOrder } from '~web/database/orm/query-builder/query-order';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';
import { addDefaultAccountAssociations } from '../account/read-accounts';

const _dateTimeHelper = new DateTimeHelper();

/**
 * Gets a single donation hub pledge from the database.
 * @param id The ID of the donation hub pledge that is to be retrieved.
 * @return A promise that resolves to the retrieved `DonationHubPledgeEntity`.
 */
export async function readDonationHubPledge(id: number): Promise<DonationHubPledgeEntity> {
  const readRequest: DonationHubPledgeReadRequest = { id, loadDonationHub: true, page: 1, limit: 1 };
  const listRes: ListResponse<DonationHubPledgeEntity> = await readDonationHubPledges(readRequest);
  return listRes.list[0];
}

/**
 * Gets a donation hub pledge that falls under a given donation hub & belongs to the current user.
 * @param donationHubId The ID of the donation hub that the pledge must fall under.
 * @param account The account of the current user.
 * @return A promise that resolves to the retrieved `DonationHubPledgeEntity`.
 */
export async function readMyPledgeUnderDonationHub(donationHubId: number, account: AccountEntity): Promise<DonationHubPledge> {
  const readRequest: DonationHubPledgeReadRequest = { donationHubId, loadDonationHub: true, page: 1, limit: 1 };
  const listRes: ListResponse<DonationHubPledgeEntity> = await readMyDonationHubPledges(readRequest, account);
  return listRes.list[0];
}

/**
 * Reads a list of donation hub pledges that belong to a given donation hub from the database.
 * @param donationHubId The ID of the donation hub that shall have its pledges read.
 * @param request The request sent by the client specifying read filters & options.
 * @return A promise that resolves to a `DonationHubPledgeEntity` list response.
 */
export async function readPledgesUnderDonationHub(
  donationHubId: number,
  request: DonationHubPledgeReadRequest
): ListResponsePromise<DonationHubPledgeEntity> {
  request = request ? request : {};
  request.donationHubId = donationHubId;
  return readDonationHubPledges(request);
}

/**
 * Gets donation hub pledges belonging to the current user.
 * @param request The request sent by the client specifying read filters & options.
 * @param account The account of the current user.
 * @return A promise that resolves to a `DonationHubPledgeEntity` list response.
 */
export async function readMyDonationHubPledges(
  request: DonationHubPledgeReadRequest,
  account: AccountEntity
): ListResponsePromise<DonationHubPledgeEntity> {
  request.accountId = account.id;
  request.loadDonationHub = request.loadDonationHub ?? true;
  return readDonationHubPledges(request);
}

/**
 * Reads a list of donation hub pledges from the database.
 * @param request The request sent by the client specifying read filters & options.
 * @return A promise that resolves to a `DonationHubPledgeEntity` list response.
 */
export async function readDonationHubPledges(request: DonationHubPledgeReadRequest): ListResponsePromise<DonationHubPledgeEntity> {
  const repository: Repository<DonationHubPledgeEntity> = getRepository(DonationHubPledgeEntity);
  let queryBuilder: SelectQueryBuilder<DonationHubPledgeEntity> = repository.createQueryBuilder('donationHubPledge');
  queryBuilder = _addRelations(queryBuilder, request);
  queryBuilder = _addFilters(queryBuilder, request);
  queryBuilder = addOrder(queryBuilder, 'donationHubPledge', request, 'createTimestamp', 'DESC');
  queryBuilder = addPagination(queryBuilder, request);
  const [donationHubPledges, totalCount] = await queryBuilder.getManyAndCount();
  return genListResponse(donationHubPledges, totalCount, request);
}

function _addRelations(
  queryBuilder: SelectQueryBuilder<DonationHubPledgeEntity>,
  request: DonationHubPledgeReadRequest
): SelectQueryBuilder<DonationHubPledgeEntity> {
  addDefaultAccountAssociations(queryBuilder, 'donationHubPledge.account', 'pledgeAccount');

  if (request.loadDonationHub) {
    queryBuilder.innerJoinAndSelect('donationHubPledge.donationHub', 'donationHub');
    addDefaultAccountAssociations(queryBuilder, 'donationHub.volunteerAccount', 'hubAccount');
  } else {
    queryBuilder.innerJoin('donationHubPledge.donationHub', 'donationHub');
  }

  return queryBuilder;
}

function _addFilters(
  queryBuilder: SelectQueryBuilder<DonationHubPledgeEntity>,
  request: DonationHubPledgeReadRequest
): SelectQueryBuilder<DonationHubPledgeEntity> {
  queryBuilder = addWhere(queryBuilder, 'donationHubPledge', request, ['id']);

  // If not looking for a specific donation hub pledge, then apply all filters.
  if (!request.id) {
    if (request.accountId) {
      queryBuilder.andWhere('pledgeAccount.id = :pledgeAccountId', { pledgeAccountId: request.accountId });
    }

    // Only apply filters pertaining to the parent donation hub if not filtering by a specific donation hub.
    (request.donationHubId)
      ? queryBuilder.andWhere('donationHub.id = :donationHubId', { donationHubId: request.donationHubId })
      : _addDonationHubFilters(queryBuilder, request);
  }

  return queryBuilder;
}

function _addDonationHubFilters(
  queryBuilder: SelectQueryBuilder<DonationHubPledgeEntity>,
  request: DonationHubPledgeReadRequest
): SelectQueryBuilder<DonationHubPledgeEntity> {
  // If not given a specific drop-off window overlap start, then incorporate default expired exclusion filter.
  if (request.dropOffWindowOverlapStart) {
    queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', { windowStart: request.dropOffWindowOverlapStart });
  } else if (!request.includeExpired) {
    queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', { windowStart: _dateTimeHelper.addHours(new Date(), -30) });
  }

  if (request.dropOffWindowOverlapEnd) {
    queryBuilder.andWhere('donationHub.dropoffWindowStart <= :windowEnd', { windowEnd: request.dropOffWindowOverlapEnd });
  }

  return queryBuilder;
}
