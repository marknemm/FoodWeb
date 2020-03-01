import { verifyAccountIsAdmin } from '~admin/helpers/admin-verification';
import { LoginRequest, LoginResponse } from '~shared';
import { FoodWebError } from '~web/helpers/response/food-web-error';
import { login } from '~web/services/session/session';

/**
 * Performs admin account login.
 * @param loginRequest The login request.
 * @return A promise that resolves to the login response.
 * @throws FoodWebError if the login credentials don't match/exist, or if the account is not an admin account.
 */
export async function adminLogin(loginRequest: LoginRequest): Promise<LoginResponse> {
  const loginResponse: LoginResponse = await login(loginRequest);
  if (!verifyAccountIsAdmin(loginResponse.account)) {
    throw new FoodWebError('Admin account required for login', 401);
  }
  return loginResponse;
}
