import { Account } from '~shared';
import { env } from '~web/helpers/globals/env';

/**
 * Verifies that a given account is an admin account.
 * @param account The account that is to be verified.
 * @return true if it is an admin account, false if not.
 */
export function verifyAccountIsAdmin(account: Account): boolean {
  return (account)
    ? (env.ADMIN_ACCOUNT_IDS.indexOf(account.id) >= 0)
    : false;
}
