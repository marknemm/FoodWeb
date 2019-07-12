import { sendEmail, MailTransporter } from '../helpers/email';
import { Account } from '../../../shared/src/interfaces/account/account';

export async function sendAccountVerificationEmail(account: Account, verificationToken: string): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Verify New FoodWeb Account',
    'account-verification',
    { verificationToken }
  ).catch(console.error);
}
