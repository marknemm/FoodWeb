import { getRepository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';
import { checkPasswordMatch } from '../helpers/password-match';
import { FoodWebError } from '../helpers/food-web-error';
import { Account } from '../../../shared/src/interfaces/account/account';
import { OperationHoursHelper } from '../../../shared/src/helpers/operation-hours-helper';

const _opHoursHelper = new OperationHoursHelper();

/**
 * Performs the login for a given user.
 * @param username The username of the user.
 * @param password The (plain text) password of the user.
 * @return A promise where on success it will provide the Account of the newly logged in user.
 */
export async function login(username: string, password: string): Promise<Account> {
  try {
    const account: AccountEntity = await _getAccountEntity(username);
    const validated: boolean = await checkPasswordMatch(account, password);
    if (validated) { return account; }
    throw new Error('Password match validation failed');
  } catch (err) {
    console.error(err);
    throw new FoodWebError('Incorrect username or password', 401);
  }
}

async function _getAccountEntity(username: string): Promise<AccountEntity> {
  const account: AccountEntity = await getRepository(AccountEntity).findOne({ username });
  if (!account) {
    throw new Error(`User could not be found with username: ${username}`);
  }

  account.verified = (await getRepository(UnverifiedAccountEntity).count({ account: { id: account.id } })) === 0;
  _opHoursHelper.formatOperationHoursTimes(account.operationHours);
  return account;
}
