import { AppDataEntity } from 'database/src/entity/app-data.entity';
import { OrmEntityManager } from '~orm/index';

export function deleteAppData(accountId: number, deviceUuid: string): Promise<AppDataEntity> {
  return OrmEntityManager.transaction((manager: OrmEntityManager) =>
    manager.getRepository(AppDataEntity).remove({ deviceUuid, accountId })
  );
}
