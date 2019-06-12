import { getRepository } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { checkPasswordMatch } from '../helpers/password-match';
import { FoodWebError } from '../helpers/food-web-error';
import { formatOperationHoursTimes } from '../helpers/operation-hours-converter';
import { Account } from '../../../shared/src/interfaces/account/account';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';

/**
 * Performs the login for a given user.
 * @param usernameEmail The username or email of the user.
 * @param password The (plain text) password of the user.
 * @return A promise where on success it will provide the Account of the newly logged in user.
 */
export async function login(usernameEmail: string, password: string): Promise<Account> {
  try {
    const account: AccountEntity = await _getAccountEntity(usernameEmail);
    const validated: boolean = await checkPasswordMatch(account, password);
    if (validated) { return account; }
    throw new Error('Password match validation failed');
  } catch (err) {
    console.error(err);
    throw new FoodWebError('Incorrect username or password', 401);
  }
}

async function _getAccountEntity(usernameEmail: string): Promise<AccountEntity> {
  const account: AccountEntity = await getRepository(AccountEntity)
    .createQueryBuilder('account')
    .innerJoinAndSelect('account.contactInfo', 'contactInfo')
    .leftJoinAndSelect('account.organization', 'organization')
    .leftJoinAndSelect('account.volunteer', 'volunteer')
    .leftJoinAndSelect('account.operationHours', 'operationHours')
    .where('account.username=:usernameEmail OR contactInfo.email=:usernameEmail', { usernameEmail })
    .getOne();

  if (!account) {
    throw new Error(`User could not be found with username/email: ${usernameEmail}`);
  }

  account.verified = (await getRepository(UnverifiedAccountEntity).count({ account: { id: account.id } })) === 0;
  formatOperationHoursTimes(account.operationHours);
  return account;
}
