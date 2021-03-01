import { AccountEntity, UnverifiedAccountEntity } from '~entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient, NotificationType } from '~web/helpers/messaging/notification';
import { NewAccountData } from './save-account';

export async function sendAccountVerificationMessage(newAccountData: NewAccountData): Promise<AccountEntity> {
  const messagePromises: Promise<any>[] = [];
  const account: AccountEntity = newAccountData.account;
  const unverifiedAccount: UnverifiedAccountEntity = newAccountData.unverifiedAccount;

  messagePromises.push(
    sendAccountVerificationEmail(account, unverifiedAccount)
  );

  messagePromises.push(
    sendAccountVerificationNotification(account)
  );

  await Promise.all(messagePromises);
  return account;
}

export async function sendAccountVerificationEmail(account: AccountEntity, unverifiedAccount: UnverifiedAccountEntity): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const verificationToken: string = unverifiedAccount.verificationToken;
  return mailClient.sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Verify New FoodWeb Account',
    'account-verification',
    { verificationToken },
    true
  ).catch(console.error);
}

export async function sendAccountVerificationNotification(account: AccountEntity): Promise<void> {
  const notificationClient: NotificationClient = getNotificationClient();
  notificationClient.sendNotification(
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
  ).catch (console.error);
}
