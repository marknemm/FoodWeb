import { AccountEntity } from '../../entity/account.entity';
import { MailTransporter, sendEmail } from '../../helpers/messaging/email';

export async function sendPasswordResetEmail(account: AccountEntity, resetToken: string): Promise<AccountEntity> {
  return _sendPasswordResetEmail(account, resetToken);
}

export function sendPasswordResetSuccessEmail(account: AccountEntity): Promise<AccountEntity> {
  return _sendPasswordResetEmail(account);
}

async function _sendPasswordResetEmail(account: AccountEntity, resetToken?: string): Promise<AccountEntity> {
  const template: string = (!resetToken ? 'password-reset-success' : 'password-reset');
  await sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Reset FoodWeb Password',
    template,
    { resetToken },
    true
  );
  return account;
}
