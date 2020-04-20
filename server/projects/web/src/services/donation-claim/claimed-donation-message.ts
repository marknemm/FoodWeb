import { AccountEntity, DonationEntity } from '~entity';
import { DonationHelper } from '~shared';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '~web/helpers/messaging/email';
import { NotificationType, sendNotification } from '~web/helpers/messaging/notification';
import { sendClaimUnavailableMessages } from './claim-unavailable-message';

const _donationHelper = new DonationHelper();

/**
 * Sends donation claimed messages to the donor and receiver users that are associated with the claimed donation.
 * @param donation The donation that has been claimed.
 * @return A promise that resolves to the newly claimed donation.
 */
export async function sendClaimedDonationMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const accounts: AccountEntity[] = [donation.claim.receiverAccount, donation.donorAccount];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      accounts,
      genDonationEmailSubject(donation),
      'donation-claimed',
      { donation, donorName, receiverName }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation Claimed`,
        icon: donation.claim.receiverAccount.profileImgUrl,
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
