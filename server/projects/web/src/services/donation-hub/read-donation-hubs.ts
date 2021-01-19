import { getRepository } from 'typeorm';
import { genOrder, genSkip, genTake } from '~orm';
import { DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

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
 * Reads a list of donation hubs from the database.
 * @param donationHubRequest The request sent by the client specifying read filters & options.
 * @return A promise that resolves to a `DonationHubEntity` list response.
 */
export async function readDonationHubs(donationHubRequest: DonationHubReadRequest): ListResponsePromise<DonationHubEntity> {
  const [donationHubs, totalCount] = await getRepository(DonationHubEntity).findAndCount({
    where: _genWhere(donationHubRequest),
    order: genOrder<DonationHubEntity>(donationHubRequest, 'dropOffWindowStart', 'ASC'),
    skip: genSkip(donationHubRequest),
    take: genTake(donationHubRequest, Number.MAX_SAFE_INTEGER)
  });
  return genListResponse(donationHubs, totalCount, donationHubRequest);
}

function _genWhere(donationHubRequest: DonationHubReadRequest): Partial<DonationHubEntity> {
  const where: Partial<DonationHubEntity> = {};

  if (donationHubRequest.id) {
    where.id = donationHubRequest.id;
  }

  return where;
}
