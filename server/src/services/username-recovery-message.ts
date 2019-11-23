import { AccountEntity, AccountType } from '../entity/account.entity';
import { MailTransporter, sendEmail } from '../helpers/email';

export async function sendUsernameRecoveryEmail(accounts: AccountEntity[]): Promise<void> {
  if (!accounts) { return; }
  const account: AccountEntity = _getMostPersonalizedAccount(accounts);
  const usernames: { username: string }[] = _accountsToUsernames(accounts);
  await sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Recover FoodWeb Username',
    'username-recovery',
    { usernames, multipleUsernames: (usernames.length > 1) }
  );
}

function _getMostPersonalizedAccount(accounts: AccountEntity[]): AccountEntity {
  let account: AccountEntity = null;
  for (let i = 0; i < accounts.length; i++) {
    account = accounts[i];
    if (account.accountType === AccountType.Volunteer) {
      break;
    }
  }
  return account;
}

function _accountsToUsernames(accounts: AccountEntity[]): { username: string }[] {
  return accounts.map((account: AccountEntity) => {
    return { username: account.username };
  });
}
