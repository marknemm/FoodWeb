import { randomBytes } from 'crypto';
import { getRepository, Repository } from 'typeorm';
import { AccountEntity, PerpetualSessionEntity, UnverifiedAccountEntity } from '~entity';
import { ListResponse, LoginRequest, LoginResponse } from '~shared';
import { checkPasswordMatch } from '~web/helpers/misc/password-match';
import { FoodWebError } from '~web/helpers/response/foodweb-error';
import { readFullAccount, readFullAccounts } from '~web/services/account/read-accounts';
import { saveMobileDevice } from '~web/services/mobile-device/save-mobile-device';

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
      const loginResponse: LoginResponse = { account };
      if (loginRequest.mobileDevice) {
        await saveMobileDevice(loginRequest.mobileDevice, account);
        loginResponse.perpetualSession = await createPerpetualSession(account);
      }
      return loginResponse;
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
  const listRes: ListResponse<AccountEntity> = await readFullAccounts({ email: usernameEmail, page: 1, limit: 2 }, null);
  if (listRes.totalCount > 1) {
    throw new FoodWebError('More than one account shares the given email. Please provide a username instead.', 401);
  }

  const account: AccountEntity = (listRes.totalCount === 0)
    ? await readFullAccount(usernameEmail) // Try to get account via username.
    : listRes.list[0];
  if (!account) {
    throw new Error(`User could not be found with username/email: ${usernameEmail}`);
  }

  account.verified = (await getRepository(UnverifiedAccountEntity).count({ account: { id: account.id } })) === 0;
  return account;
}

/**
 * Saves a long-lived perpetual session for a given account.
 * @param account The account that the session is associated with.
 * @return A promise that resolves to the long-lived app session.
 */
 export async function createPerpetualSession(account: AccountEntity): Promise<PerpetualSessionEntity> {
  const repository: Repository<PerpetualSessionEntity> = getRepository(PerpetualSessionEntity);
  await repository.delete({ account });
  const perpetualSession = new PerpetualSessionEntity(account);
  let duplicateToken = false;
  do {
    perpetualSession.sessionToken = randomBytes(10).toString('hex'); // Gen 20 char token.
    duplicateToken = (await repository.count({ sessionToken: perpetualSession.sessionToken })) !== 0;
  } while (duplicateToken);
  return await repository.save(perpetualSession);
}

/**
 * Performs the login using a given long-lived perpetual session token.
 * @param sessionToken The long-lived perpetual session token.
 * @return A promise where on success it will provide the Account of the newly logged in user.
 * @throws A FoodWebError with status 401 when the login fails.
 */
export async function perpetualTokenLogin(sessionToken: string): Promise<LoginResponse> {
  try {
    if (sessionToken) {
      const perpetualSession: PerpetualSessionEntity = await getRepository(PerpetualSessionEntity).findOne({ sessionToken });
      if (perpetualSession) {
        return { account: perpetualSession.account, perpetualSession };
      }
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
  await getRepository(PerpetualSessionEntity).delete({ account })
    .catch((err: Error) => console.error(err));
}
