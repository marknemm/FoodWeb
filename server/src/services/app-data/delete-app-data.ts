import { AppDataEntity } from '../../entity/app-data.entity';
import { OrmEntityManager } from '../../helpers/database/orm';

export function deleteAppData(accountId: number, deviceUuid: string): Promise<AppDataEntity> {
  return OrmEntityManager.transaction((manager: OrmEntityManager) =>
    manager.getRepository(AppDataEntity).remove({ deviceUuid, accountId })
  );
}
