import { AccountEntity } from 'database/src/entity/account.entity';
import { UnverifiedAccountEntity } from 'database/src/entity/unverified-account.entity';
import { MailTransporter, sendEmail } from '~web/helpers/messaging/email';
import { NotificationType, sendNotification } from '~web/helpers/messaging/notification';
import { NewAccountData } from './save-account';

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
        notificationLink: `/account/my`,
        title: 'Welcome to FoodWeb!',
        icon: './assets/IconImgSm.png',
        body: `
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
    { verificationToken },
    true
  ).catch(console.error);
}
