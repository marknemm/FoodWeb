import { AccountEntity, DonationEntity } from '~entity';
import { DonationHelper } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient, NotificationType } from '~web/helpers/messaging/notification';
import { sendDeliveryUnavailableMessages } from './delivery-unavailable-message';

const _donationHelper = new DonationHelper();

export async function sendDeliveryScheduledMessages(donation: DonationEntity): Promise<DonationEntity> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, donation.claim.delivery.volunteerAccount];
  const { donorName, receiverName, delivererName } = _donationHelper.memberNames(donation);

  messagePromises.push(
    mailClient.broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      _donationHelper.genDonationEmailSubject(donation),
      'delivery-scheduled',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationLink: `/donation/${donation.id}`,
        title: 'Delivery Scheduled',
        icon: donation.claim.delivery.volunteerAccount.profileImg,
        body: `
          Donation pickup scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      donation.claim.receiverAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationLink: `/donation/${donation.id}`,
        title: 'Delivery Scheduled',
        icon: donation.claim.delivery.volunteerAccount.profileImg,
        body: `
          Donation delivery scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendDeliveryUnavailableMessages(donation)
  );

  await Promise.all(messagePromises);
  return donation;
}
