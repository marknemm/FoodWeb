import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '~entity';
import { addOrder, addPagination, addWhere } from '~orm';
import { DateTimeHelper, DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';
import { addDefaultAccountAssociations } from '../account/read-accounts';

const _dateTimeHelper = new DateTimeHelper();

/**
 * Gets a single donation hub from the database.
 * @param id The ID of the donation hub that is to be retrieved.
 * @return A promise that resolves to the retrieved donation hub.
 */
export async function readDonationHub(id: number): Promise<DonationHubEntity> {
  const readRequest: DonationHubReadRequest = { id, page: 1, limit: 1 };
  const listRes: ListResponse<DonationHubEntity> = await readDonationHubs(readRequest);
  return listRes.list[0];
}

/**
 * Gets a list of donation hubs belonging to the current user from the database.
 * @param donationHubRequest The request sent by the client specifying read filters & options.
 * @param account The account of the current user.
 * @return A promise that resolves to a `DonationHubEntity` list response.
 */
export async function readMyDonationHubs(
  donationHubRequest: DonationHubReadRequest,
  account: AccountEntity
): ListResponsePromise<DonationHubEntity> {
  donationHubRequest.volunteerAccountId = account.id;
  return readDonationHubs(donationHubRequest);
}

/**
 * Reads a list of donation hubs from the database.
 * @param request The request sent by the client specifying read filters & options.
 * @return A promise that resolves to a `DonationHubEntity` list response.
 */
export async function readDonationHubs(request: DonationHubReadRequest): ListResponsePromise<DonationHubEntity> {
  const repository: Repository<DonationHubEntity> = getRepository(DonationHubEntity);
  const queryBuilder: SelectQueryBuilder<DonationHubEntity> = repository.createQueryBuilder('donationHub');
  _addRelations(queryBuilder);
  _addFilters(queryBuilder, request);
  _addSorting(queryBuilder, request);
  addPagination(queryBuilder, request);
  const [donationHubs, totalCount] = await queryBuilder.getManyAndCount();
  return genListResponse(donationHubs, totalCount, request);
}

function _addRelations(queryBuilder: SelectQueryBuilder<DonationHubEntity>): void {
  addDefaultAccountAssociations(queryBuilder, 'donationHub.volunteerAccount', 'hubAccount');
  queryBuilder.leftJoin('donationHub.contactOverride', 'contactOverride');
}

function _addFilters(queryBuilder: SelectQueryBuilder<DonationHubEntity>, request: DonationHubReadRequest): void {
  addWhere(queryBuilder, 'donationHub', request, ['id']);

  // If not looking for a specific donation hub, then apply all filters.
  if (!request.id) {
    if (request.volunteerAccountId) {
      queryBuilder.andWhere('hubAccount.id = :hubAccountId', { hubAccountId: request.volunteerAccountId });
    }

    // If not given a specific drop-off window overlap start, then incorporate default expired exclusion filter.
    if (request.dropOffWindowOverlapStart) {
      queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', { windowStart: request.dropOffWindowOverlapStart });
    } else if (!request.includeExpired) {
      queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', { windowStart: _dateTimeHelper.addHours(new Date(), -30) });
    }

    if (request.dropOffWindowOverlapEnd) {
      queryBuilder.andWhere('donationHub.dropoffWindowStart <= :windowEnd', { windowEnd: request.dropOffWindowOverlapEnd });
    }
  }
}

function _addSorting(queryBuilder: SelectQueryBuilder<DonationHubEntity>, request: DonationHubReadRequest): void {
  addOrder(queryBuilder, 'donationHub', request, 'dropOffWindowStart', 'ASC');
}
