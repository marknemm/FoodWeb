import { broadcastEmail, MailTransporter } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';
import { sendNotification, NotificationType } from '../helpers/push-notification';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

export async function sendDonationDeleteSuccessEmail(donation: DonationEntity): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount];
  const notificationAccounts: AccountEntity[] = [];
  const donorName: string = _donationHelper.donorName(donation);
  let receiverName = '';
  let delivererName = '';
  const emailSubjects = ['Successfully Deleted Donation'];

  // If donation was claimed by a receiver, then we must also notify them.
  if (donation.receiverAccount) {
    emailAccounts.push(donation.receiverAccount);
    notificationAccounts.push(donation.receiverAccount);
    receiverName = _donationHelper.receiverName(donation);
    emailSubjects.push(`Claimed Donation Deleted by ${donorName}`);
  }

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (donation.delivery) {
    emailAccounts.push(donation.delivery.volunteerAccount);
    notificationAccounts.push(donation.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(donation);
    emailSubjects.push(`Delivery Cancelled by ${donorName}`);
  }

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      emailSubjects,
      'donation-deleted',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  if (notificationAccounts.length > 0) {
    messagePromises.push(
      sendNotification(
        notificationAccounts[0],
        {
          notificationType: NotificationType.RemoveDonation,
          notificationDetailId: donation.id,
          notificationTitle: `Donation Deleted`,
          notificationIconUrl: donation.donorAccount.profileImgUrl,
          notificationBody: `
            Claimed Donation Deleted by <strong>${donorName}</strong>.<br>
            <i>${donation.description}</i>
          `
        }
      ).catch(console.error)
    );
  }

  if (notificationAccounts.length > 1) {
    messagePromises.push(
      sendNotification(
        notificationAccounts[1],
        {
          notificationType: NotificationType.RemoveDonation,
          notificationDetailId: donation.id,
          notificationTitle: `Donation Deleted`,
          notificationIconUrl: donation.donorAccount.profileImgUrl,
          notificationBody: `
            Delivery Cancelled by <strong>${donorName}</strong>.<br>
            <i>${donation.description}</i>
          `
        }
      ).catch(console.error)
    );
  }

  await Promise.all(messagePromises);
}
