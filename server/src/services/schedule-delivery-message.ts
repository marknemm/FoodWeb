import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { broadcastEmail, MailTransporter, genDonationEmailSubject } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { Donation, DonationHelper } from '../shared';

const _donationHelper = new DonationHelper();

export async function sendDeliveryScheduledMessages(donation: DonationEntity): Promise<Donation> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);

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
        icon: donation.delivery.volunteerAccount.profileImgUrl,
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
        icon: donation.delivery.volunteerAccount.profileImgUrl,
        body: `
          Donation delivery scheduled by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
  return donation;
}
