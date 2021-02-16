import { AccountEntity } from '~entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';

export async function sendPasswordResetEmail(account: AccountEntity, resetToken: string): Promise<AccountEntity> {
  return _sendPasswordResetEmail(account, resetToken);
}

export function sendPasswordResetSuccessEmail(account: AccountEntity): Promise<AccountEntity> {
  return _sendPasswordResetEmail(account);
}

async function _sendPasswordResetEmail(account: AccountEntity, resetToken?: string): Promise<AccountEntity> {
  const mailClient: MailClient = await getMailClient();
  const template: string = (!resetToken ? 'password-reset-success' : 'password-reset');
  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Reset FoodWeb Password',
    template,
    { resetToken },
    true
  );
  return account;
}
