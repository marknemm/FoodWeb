import { MailTransporter, sendEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';

export async function sendPasswordResetEmail(account: AccountEntity, resetToken: string, resetComplete: boolean): Promise<void> {
  const template: string = (resetComplete ? 'password-reset-success' : 'password-reset');
  return sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Reset FoodWeb Password',
    template,
    { resetToken }
  );
}
