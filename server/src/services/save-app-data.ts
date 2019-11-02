import { getConnection, EntityManager } from 'typeorm';
import { AppDataEntity, AppData } from '../entity/app-data.entity';
import { AccountEntity } from '../entity/account.entity';

export function saveAppData(appData: AppData, account: AccountEntity): Promise<AppDataEntity> {
  (<AppDataEntity>appData).accountId = account.id;
  return getConnection().transaction((manager: EntityManager) => {
    return manager.getRepository(AppDataEntity).save(appData);
  });
}
