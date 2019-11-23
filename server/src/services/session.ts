import { randomBytes } from 'crypto';
import { getRepository, Repository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { AppSessionEntity } from '../entity/app-session.entity';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';
import { FoodWebError } from '../helpers/food-web-error';
import { checkPasswordMatch } from '../helpers/password-match';
import { QueryResult } from '../helpers/query-builder-helper';
import { LoginRequest, LoginResponse } from '../shared';
import { readFullAccount, readFullAccounts } from './read-accounts';

/**
 * Performs the login for a given user.
 * @param loginRequest The login request containing the username/email and password.
 * @return A promise where on success it will provide the Account of the newly logged in user.
 * @throws A FoodWebError with status 401 when the login fails.
 */
export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
  try {
    const account: AccountEntity = await _getAccountEntity(loginRequest.usernameEmail);
    const validated: boolean = await checkPasswordMatch(account, loginRequest.password);
    if (validated) {
      return _handleValidationSuccess(account, loginRequest.isApp);
    }
    throw new Error('Password match validation failed');
  } catch (err) {
    console.error(err);
    throw (err.status === 401)
      ? err
      : new FoodWebError('Incorrect username or password', 401);
  }
}

/**
 * Gets an account entity via username match.
 * @param usernameEmail The username or email of the account entity to retrieve.
 * @return A promise that resolves to the matched account entity.
 * @throws An error when an account entity match cannot be found.
 */
async function _getAccountEntity(usernameEmail: string): Promise<AccountEntity> {
  // Try to get account via email address.
  let queryResult: QueryResult<AccountEntity> = await readFullAccounts({ email: usernameEmail, page: 1, limit: 2 }, null);
  if (queryResult.totalCount > 1) {
    throw new FoodWebError('More than one account shares the given email. Please provide a username instead.', 401);
  }

  const account: AccountEntity = (queryResult.totalCount === 0)
    ? await readFullAccount(usernameEmail) // Try to get account via username.
    : queryResult.entities[0];
  if (!account) {
    throw new Error(`User could not be found with username/email: ${usernameEmail}`);
  }
  
  account.verified = (await getRepository(UnverifiedAccountEntity).count({ account: { id: account.id } })) === 0;
  return account;
}

/**
 * Saves a long-lived mobile app session token (entity) for a given account.
 * @param account The account that to token is associated with.
 * @return A promise that resolves to the saved long-lived mobile app session token.
 */
export async function saveAppSessionToken(account: AccountEntity): Promise<string> {
  const repository: Repository<AppSessionEntity> = getRepository(AppSessionEntity);
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
 * Handles validation success by generating a login response.
 * @param account The account that has been validated.
 * @param isApp Whether or not the client that requested validation is a mobile app.
 * @return A promise that resolves to the login response.
 */
async function _handleValidationSuccess(account: AccountEntity, isApp: boolean): Promise<LoginResponse> {
  const appSessionToken: string = (isApp)
    ? await saveAppSessionToken(account)
    : null;
  return { account, appSessionToken };
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
      return _handleValidationSuccess(appSessionEntity.account, true);
    }
    throw new Error('Mobile app session token not found');
  } catch (err) {
    console.error(err);
    throw new FoodWebError('App authentication failed', 401);
  }
}

/**
 * Deletes any saved session data associated with an account of a user that is logging out.
 * @param account The account of the user that is logging out.
 * @return A promise that resolves to void on completion.
 */
export async function logout(account: AccountEntity): Promise<void> {
  await getRepository(AppSessionEntity).delete({ account })
    .catch((err: Error) => console.error(err));
}
