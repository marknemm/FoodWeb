import { randomBytes } from 'crypto';
import { getRepository, Repository } from 'typeorm';
import { AccountEntity, AppSessionEntity } from '~entity';
import { getOrmRepository } from '~orm';
import { LoginResponse } from '~shared';
import { FoodWebError } from '~web/helpers/response/foodweb-error';

/**
 * Saves a long-lived mobile app session token (entity) for a given account.
 * @param account The account that to token is associated with.
 * @return A promise that resolves to the saved long-lived mobile app session token.
 */
export async function saveAppSessionToken(account: AccountEntity): Promise<string> {
  const repository: Repository<AppSessionEntity> = getOrmRepository(AppSessionEntity);
  await repository.delete({ account });
  let appSessionEntity: AppSessionEntity;
  let duplicateToken: boolean;
  do {
    appSessionEntity = _genAppSessionEntity(account);
    duplicateToken = (await repository.count({ appSessionToken: appSessionEntity.appSessionToken })) !== 0;
  } while (duplicateToken);
  appSessionEntity = await getRepository(AppSessionEntity).save(appSessionEntity);
  return appSessionEntity.appSessionToken;
}

/**
 * Generates a mobile app session entity for a given account.
 * @param account The account assoicated with the entity that is to be generated.
 * @return The generated app session entity.
 */
function _genAppSessionEntity(account: AccountEntity): AppSessionEntity {
  const appSessionEntity = new AppSessionEntity();
  appSessionEntity.account = account;
  appSessionEntity.appSessionToken = randomBytes(10).toString('hex'); // Gen 20 char token.
  return appSessionEntity;
}

/**
 * Performs the login using a given long-lived mobile app session token.
 * @param appSessionToken The long-lived mobile app session token.
 * @return A promise where on success it will provide the Account of the newly logged in user.
 * @throws A FoodWebError with status 401 when the login fails.
 */
export async function appTokenLogin(appSessionToken: string): Promise<LoginResponse> {
  try {
    const appSessionEntity: AppSessionEntity = await getRepository(AppSessionEntity).findOne({ appSessionToken });
    if (appSessionEntity) {
      saveAppSessionToken(appSessionEntity.account);
      return { account: appSessionEntity.account, appSessionToken };
    }
    throw new Error('Mobile app session token not found');
  } catch (err) {
    console.error(err);
    throw new FoodWebError('App authentication failed', 401);
  }
}
