import { getRepository, In } from 'typeorm';
import { AppDataEntity } from '../entity/app-data.entity';
import { genSkip, genTake } from '../helpers/query-builder-helper';
import { AppDataReadRequest } from '../../../shared/src/interfaces/app-data/app-data-read-request';

export interface AppDataQueryResult {
  appDataArr: AppDataEntity[];
  totalCount: number;
}

/**
 * Reads app data entries from the database.
 * @param request The app data read request used to perform filtering and paging.
 * @return A promise that resolves to the app data query result.
 */
export async function readAppData(request: AppDataReadRequest): Promise<AppDataQueryResult> {
  const [appDataArr, totalCount]: [AppDataEntity[], number] = await getRepository(AppDataEntity).findAndCount({
    where: { accountId: In(request.accountIds) },
    order: { accountId: 'ASC' },
    skip: genSkip(request),
    take: genTake(request)
  });
  return { appDataArr, totalCount };
}
