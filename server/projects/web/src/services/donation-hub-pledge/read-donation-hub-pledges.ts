import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { addPagination, addWhere } from '~orm';
import { DonationHubPledgeReadRequest, ListResponse } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { addOrder } from '~web/database/orm/query-builder/query-order';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';
import { addDefaultAccountAssociations } from '../account/read-accounts';

/**
 * Gets a single donation hub pledge from the database.
 * @param id The ID of the donation hub pledge that is to be retrieved.
 * @return A promise that resolves to the retrieved donation hub pledge.
 */
export async function readDonationHubPledge(id: number): Promise<DonationHubPledgeEntity> {
  const readRequest: DonationHubPledgeReadRequest = { id, page: 1, limit: 1, loadDonationHub: true };
  const listRes: ListResponse<DonationHubPledgeEntity> = await readDonationHubPledges(readRequest);
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

  if (request.donationHubId) {
    queryBuilder.andWhere('donationHub.id = :id', { id: request.donationHubId });
  }

  return queryBuilder;
}
