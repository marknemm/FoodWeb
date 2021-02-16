import { AccountEntity, AccountType } from '~entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';

export async function sendUsernameRecoveryEmail(accounts: AccountEntity[]): Promise<void> {
  if (!accounts) { return; }
  const mailClient: MailClient = await getMailClient();
  const account: AccountEntity = _getMostPersonalizedAccount(accounts);
  const usernames: { username: string }[] = _accountsToUsernames(accounts);
  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Recover FoodWeb Username',
    'username-recovery',
    { usernames, multipleUsernames: (usernames.length > 1) },
    true
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
