import { MailTransporter, broadcastEmail } from '../helpers/email';
import { sendNotification, NotificationType } from '../helpers/push-notification';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function sendDeliveryScheduledMessages(donation: DonationEntity): Promise<Donation> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const emailHeaders = [
    `Donation Delivery Scheduled for pickup by ${delivererName}`,
    `Donation Delivery Scheduled for drop-off by ${delivererName}`,
    `Delivery Successfully Scheduled from ${donorName} to ${receiverName}`
  ];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      emailHeaders,
      'delivery-scheduled',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationDetailId: donation.id,
        notificationLink: `/donation/details/${donation.id}`,
        notificationTitle: 'Delivery Scheduled',
        notificationIconUrl: donation.delivery.volunteerAccount.profileImgUrl,
        notificationBody: `
          Donation pickup scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.receiverAccount,
      {
        notificationType: NotificationType.ScheduleDelivery,
        notificationDetailId: donation.id,
        notificationLink: `/donation/details/${donation.id}`,
        notificationTitle: 'Delivery Scheduled',
        notificationIconUrl: donation.delivery.volunteerAccount.profileImgUrl,
        notificationBody: `
          Donation delivery scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
  return donation;
}
