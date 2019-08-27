import { NewAccountData } from './save-account';
import { sendEmail, MailTransporter } from '../helpers/email';
import { sendNotification, NotificationType } from '../helpers/push-notification';
import { AccountEntity } from '../entity/account.entity';
import { UnverifiedAccountEntity } from '../entity/unverified-account.entity';

export async function sendAccountVerificationMessage(newAccountData: NewAccountData): Promise<AccountEntity> {
  const messagePromises: Promise<any>[] = [];
  const account: AccountEntity = newAccountData.account;
  const unverifiedAccount: UnverifiedAccountEntity = newAccountData.unverifiedAccount;

  messagePromises.push(
    sendAccountVerificationEmail(account, unverifiedAccount)
  );

  messagePromises.push(
    sendNotification(
      account,
      {
        notificationType: NotificationType.Signup,
        notificationDetailId: account.id,
        notificationLink: `/account-details/${account.id}`,
        notificationTitle: 'Welcome to FoodWeb!',
        notificationIconUrl: '/assets/IconImgSm.png',
        notificationBody: `
          Please check your email for an account verification link.
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
  return account;
}

export function sendAccountVerificationEmail(account: AccountEntity, unverifiedAccount: UnverifiedAccountEntity): Promise<void> {
  const verificationToken: string = unverifiedAccount.verificationToken;
  return sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Verify New FoodWeb Account',
    'account-verification',
    { verificationToken }
  ).catch(console.error);
}
