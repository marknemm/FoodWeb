import { getRepository, In } from 'typeorm';
import { MobileDeviceEntity } from '~entity';
import { genSkip, genTake } from '~orm';
import { MobileDeviceReadRequest } from '~shared';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

/**
 * Reads mobile device entries from the database.
 * @param request The mobile device read request used to perform filtering and paging.
 * @return A promise that resolves to the mobile device query result.
 */
export async function readMobileDevice(request: MobileDeviceReadRequest): ListResponsePromise<MobileDeviceEntity> {
  const [mobileDeviceArr, totalCount]: [MobileDeviceEntity[], number] = await getRepository(MobileDeviceEntity).findAndCount({
    where: { accountId: In(request.accountIds) },
    order: { accountId: 'ASC' },
    skip: genSkip(request),
    take: genTake(request)
  });
  return genListResponse(mobileDeviceArr, totalCount, request);
}
