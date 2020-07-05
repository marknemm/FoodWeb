import { AppDataEntity } from '~entity';
import { OrmEntityManager } from '~orm';

export function deleteAppData(accountId: number, deviceUuid: string): Promise<AppDataEntity> {
  return OrmEntityManager.transaction((manager: OrmEntityManager) =>
    manager.getRepository(AppDataEntity).remove({ deviceUuid, accountId })
  );
}
