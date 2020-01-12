import { AccountEntity } from '../../entity/account.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../../helpers/messaging/email';
import { NotificationType, sendNotification } from '../../helpers/messaging/notification';
import { Donation, DonationHelper } from '../../shared';
import { sendDeliveryUnavailableMessages } from './delivery-unavailable-message';

const _donationHelper = new DonationHelper();

export async function sendDeliveryScheduledMessages(donation: DonationEntity): Promise<Donation> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, donation.claim.delivery.volunteerAccount];
  const { donorName, receiverName, delivererName } = _donationHelper.memberNames(donation);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      genDonationEmailSubject(donation),
      'delivery-scheduled',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationLink: `/donation/details/${donation.id}`,
        title: 'Delivery Scheduled',
        icon: donation.claim.delivery.volunteerAccount.profileImgUrl,
        body: `
          Donation pickup scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.claim.receiverAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationLink: `/donation/details/${donation.id}`,
        title: 'Delivery Scheduled',
        icon: donation.claim.delivery.volunteerAccount.profileImgUrl,
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
