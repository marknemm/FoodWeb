import { AccountEntity } from '~entity';
import { ImpersonateRequest, LoginRequest, LoginResponse } from '~shared';
import { RedisStore } from '~web/helpers/misc/redis-store';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { ImpersonateRecord } from '~web/interfaces/impersonate-record';
import { readFullAccount } from '~web/services/account/read-accounts';
import { login } from '~web/services/session/session';

/**
 * Performs impersonation login.
 * @param impersonateRequest The impersonate (login) request.
 * @return A promsie that resolves to the login response.
 * @throws FoodWebError if the admin login credentials are invalid or if an impersonation record doesn't exist
 * for the given admin account and impersonation record.
 */
export async function impersonateLogin(impersonateRequest: ImpersonateRequest): Promise<LoginResponse> {
  const redisStore: RedisStore = RedisStore.getStore();
  const impersonateRecord: ImpersonateRecord = await redisStore.get(impersonateRequest.impersonationToken);
  await _ensureCanImpersonate(impersonateRequest, impersonateRecord);
  const impersonateResponse: LoginResponse = await _genImpersonateLoginResponse(impersonateRecord);
  redisStore.del(impersonateRequest.impersonationToken); // Delete one-time use token on successful login.
  return impersonateResponse;
}

/**
 * Determines whether or not a given impersonation request is allowed.
 * @param impersonateRequest The impersonate (login) request.
 * @param impersonateRecord The impersonate record describing which admin account may impersonate a standard account.
 * @return A promise that resolves if the user is allowed to impersonate a target account.
 * @throws FoodWebError if the user is not allowed to impersonate a target account.
 */
async function _ensureCanImpersonate(impersonateRequest: ImpersonateRequest, impersonateRecord: ImpersonateRecord): Promise<void> {
  const loginRequest: LoginRequest = {
    usernameEmail: impersonateRequest.impersonatorUsernameEmail,
    password: impersonateRequest.impersonatorPassword
  };
  const loginResponse: LoginResponse = await login(loginRequest);
  if (loginResponse.account.id !== impersonateRecord.adminAccountId) {
    throw new FoodWebError('Impersonation access denied', 401);
  }
}

/**
 * Generates an impersonate login response, which will be returned to the client for successful login.
 * @param impersonateRecord The impersonate record used for impersonation login.
 * @return A promise that resolves to the impersonate login response.
 */
async function _genImpersonateLoginResponse(impersonateRecord: ImpersonateRecord): Promise<LoginResponse> {
  const impersonateAccount: AccountEntity = await readFullAccount(impersonateRecord.targetAccountId);
  return { account: impersonateAccount };
}
