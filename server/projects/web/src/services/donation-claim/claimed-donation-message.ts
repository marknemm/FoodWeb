import { AccountEntity, DonationEntity } from '~entity';
import { DonationHelper } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient, NotificationType } from '~web/helpers/messaging/notification';
import { sendClaimUnavailableMessages } from './claim-unavailable-message';

const _donationHelper = new DonationHelper();

/**
 * Sends donation claimed messages to the donor and receiver users that are associated with the claimed donation.
 * @param donation The donation that has been claimed.
 * @return A promise that resolves to the newly claimed donation.
 */
export async function sendClaimedDonationMessages(donation: DonationEntity): Promise<DonationEntity> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  const accounts: AccountEntity[] = [donation.claim.receiverAccount, donation.donorAccount];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);

  messagePromises.push(
    mailClient.broadcastEmail(
      MailTransporter.NOREPLY,
      accounts,
      _donationHelper.genDonationEmailSubject(donation),
      'donation-claimed',
      { donation, donorName, receiverName }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation Claimed`,
        icon: donation.claim.receiverAccount.profileImg,
        body: `
          Donation claimed by <strong>${receiverName}</strong>:<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendClaimUnavailableMessages(donation)
  );

  return donation;
}
