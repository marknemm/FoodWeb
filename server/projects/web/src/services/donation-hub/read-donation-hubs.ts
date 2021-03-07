import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '~entity';
import { addOrder, addPagination, addWhere, QueryMod } from '~orm';
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
  return readDonationHubs(donationHubRequest, account);
}

/**
 * Reads a list of donation hubs from the database.
 * @param request The request sent by the client specifying read filters & options.
 * @param account The optional accoun to of the current user.
 * @return A promise that resolves to a `DonationHubEntity` list response.
 */
export async function readDonationHubs(
  request: DonationHubReadRequest,
  account?: AccountEntity
): ListResponsePromise<DonationHubEntity> {
  return queryDonationHubs(request, account).exec();
}

/**
 * Queries a list of donation hubs from the database, and exposes a query modifier that may be used to
 * modify the query before sending it to the database.
 * @param request The request sent by the client specifying read filters & options.
 * @param account The optional account of the user issuing the query.
 * @return A query modifier which may be used to modify the query before reading donation hubs.
 */
export function queryDonationHubs(request: DonationHubReadRequest, account?: AccountEntity): QueryMod<DonationHubEntity> {
  const repository: Repository<DonationHubEntity> = getRepository(DonationHubEntity);
  const queryBuilder: SelectQueryBuilder<DonationHubEntity> = _buildQuery(repository, request, account);
  return new QueryMod<DonationHubEntity>(
    queryBuilder,
    async () => {
      const [donationHubs, totalCount] = await queryBuilder.getManyAndCount();
      return genListResponse(donationHubs, totalCount, request);
    }
  );
}

function _buildQuery(
  repository: Repository<DonationHubEntity>,
  request: DonationHubReadRequest,
  account: AccountEntity
): SelectQueryBuilder<DonationHubEntity> {
  const queryBuilder: SelectQueryBuilder<DonationHubEntity> = repository.createQueryBuilder('donationHub');
  _addRelations(queryBuilder, request);
  _addFilters(queryBuilder, request, account);
  _addSorting(queryBuilder, request);
  addPagination(queryBuilder, request);
  return queryBuilder;
}

function _addRelations(queryBuilder: SelectQueryBuilder<DonationHubEntity>, request: DonationHubReadRequest): void {
  addDefaultAccountAssociations(queryBuilder, 'donationHub.volunteerAccount', 'hubAccount');
  queryBuilder.leftJoin('donationHub.contactOverride', 'contactOverride');
  (request.loadPledges) // Only select pledges if configured to do so in request.
    ? queryBuilder.leftJoinAndMapMany('donationHub.pledges', 'donationHub.pledges', 'pledge')
    : queryBuilder.leftJoin('donationHub.pledges', 'pledge');
  addDefaultAccountAssociations(queryBuilder, 'pledge.account', 'pledgeAccount', !request.loadPledges);
}

function _addFilters(queryBuilder: SelectQueryBuilder<DonationHubEntity>, request: DonationHubReadRequest, account: AccountEntity): void {
  addWhere(queryBuilder, 'donationHub', request, ['id']);

  // If not looking for a specific donation hub, then apply all filters.
  if (!request.id) {
    if (request.volunteerAccountId) {
      queryBuilder.andWhere('hubAccount.id = :hubAccountId', { hubAccountId: request.volunteerAccountId });
    } else if (request.excludeMyHubs && account) {
      queryBuilder.andWhere('hubAccount.id <> :hubAccountId', { hubAccountId: account.id });
      queryBuilder.andWhere('(pledgeAccount.id IS NULL OR pledgeAccount.id <> :pledgeAccountId)', { pledgeAccountId: account.id });
    }

    // If not given a specific drop-off window overlap start, then incorporate default expired exclusion filter.
    if (request.dropOffWindowOverlapStart) {
      queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', { windowStart: request.dropOffWindowOverlapStart });
    } else if (!request.includeExpired) {
      // If looking for hubs to donate to, expired ones should not show up. Else, give 30 hr buffer show recent expired.
      const expireHrBuffer: number = (request.excludeMyHubs ? 0 : 30);
      queryBuilder.andWhere('donationHub.dropOffWindowEnd >= :windowStart', {
        windowStart: _dateTimeHelper.addHours(new Date(), -expireHrBuffer)
      });
    }

    if (request.dropOffWindowOverlapEnd) {
      queryBuilder.andWhere('donationHub.dropoffWindowStart <= :windowEnd', { windowEnd: request.dropOffWindowOverlapEnd });
    }
  }
}

function _addSorting(queryBuilder: SelectQueryBuilder<DonationHubEntity>, request: DonationHubReadRequest): void {
  addOrder(queryBuilder, 'donationHub', request, 'dropOffWindowStart', 'ASC');
}
