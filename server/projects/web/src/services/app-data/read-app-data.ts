import { getRepository, In } from 'typeorm';
import { AppDataEntity } from '~entity';
import { genSkip, genTake, QueryResult } from '~orm';
import { AppDataReadRequest } from '~shared';

/**
 * Reads app data entries from the database.
 * @param request The app data read request used to perform filtering and paging.
 * @return A promise that resolves to the app data query result.
 */
export async function readAppData(request: AppDataReadRequest): Promise<QueryResult<AppDataEntity>> {
  const [appDataArr, totalCount]: [AppDataEntity[], number] = await getRepository(AppDataEntity).findAndCount({
    where: { accountId: In(request.accountIds) },
    order: { accountId: 'ASC' },
    skip: genSkip(request),
    take: genTake(request)
  });
  return { entities: appDataArr, totalCount };
}
