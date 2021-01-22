import { getRepository } from 'typeorm';
import { genOrder, genSkip, genTake } from '~orm';
import { DonationHubReadRequest, ListResponse } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

/**
 * Gets a single donation hub from the database.
 * @param id The ID of the donation hub that is to be retrieved.
 * @return A promise that resolves to the retrieved donation hub.
 */
export async function readDonationHubPledge(id: number): Promise<DonationHubPledgeEntity> {
  const readRequest: DonationHubReadRequest = { id, page: 1, limit: 1 };
  const listRes: ListResponse<DonationHubPledgeEntity> = await readDonationHubPledges(readRequest);
  return listRes.list[0];
}

/**
 * Reads a list of donation hubs from the database.
 * @param donationHubRequest The request sent by the client specifying read filters & options.
 * @return A promise that resolves to a `DonationHubPledgeEntity` list response.
 */
export async function readDonationHubPledges(donationHubRequest: DonationHubReadRequest): ListResponsePromise<DonationHubPledgeEntity> {
  const [donationHubs, totalCount] = await getRepository(DonationHubPledgeEntity).findAndCount({
    order: genOrder<DonationHubPledgeEntity>(donationHubRequest, 'createTimestamp', 'DESC'),
    skip: genSkip(donationHubRequest),
    take: genTake(donationHubRequest, Number.MAX_SAFE_INTEGER)
  });
  return genListResponse(donationHubs, totalCount, donationHubRequest);
}
