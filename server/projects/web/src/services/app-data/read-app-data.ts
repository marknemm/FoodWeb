import { getRepository, In } from 'typeorm';
import { AppDataEntity } from '~entity';
import { genSkip, genTake } from '~orm';
import { AppDataReadRequest } from '~shared';
import { genListResponse, ListResponsePromise } from '~web/helpers/response/list-response';

/**
 * Reads app data entries from the database.
 * @param request The app data read request used to perform filtering and paging.
 * @return A promise that resolves to the app data query result.
 */
export async function readAppData(request: AppDataReadRequest): ListResponsePromise<AppDataEntity> {
  const [appDataArr, totalCount]: [AppDataEntity[], number] = await getRepository(AppDataEntity).findAndCount({
    where: { accountId: In(request.accountIds) },
    order: { accountId: 'ASC' },
    skip: genSkip(request),
    take: genTake(request)
  });
  return genListResponse(appDataArr, totalCount, request);
}
