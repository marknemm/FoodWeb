import 'dotenv';
import { Account } from '~shared';

const _adminAccountIds: number[] = process.env.ADMIN_ACCOUNT_IDS.split(',').map(
  (idStr: string) => Number.parseInt(idStr, 10)
);

/**
 * Verifies that a given account is an admin account.
 * @param account The account that is to be verified.
 * @return true if it is an admin account, false if not.
 */
export function verifyAccountIsAdmin(account: Account): boolean {
  return (account)
    ? (_adminAccountIds.indexOf(account.id) >= 0)
    : false;
}
