import { EntityManager, getConnection } from 'typeorm';
import { AppDataEntity } from '../entity/app-data.entity';

export function deleteAppData(accountId: number, deviceUuid: string): Promise<AppDataEntity> {
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(AppDataEntity).remove({ deviceUuid, accountId });
  });
}
