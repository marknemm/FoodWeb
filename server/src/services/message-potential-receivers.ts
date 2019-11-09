import { FoundPotentialReceivers } from './find-potential-receivers';
import { AccountEntity } from '../entity/account.entity';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { broadcastNotification } from '../helpers/notification';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { NotificationType } from '../../../shared/src/interfaces/notification/notification';

const _donationHelper = new DonationHelper();

/**
 * Messages potential receivers so that they may be aware of a new donation and potentially claim it.
 * @param foundPotentialReceivers The found potential receivers' accounts and associated donation.
 * @return A promise that resolves to void once all messages/notifications have been sent.
 */
export async function messagePotentialReceivers(foundPotentialReceivers: FoundPotentialReceivers): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donation: Donation = foundPotentialReceivers.donation;
  const potentialReceivers: AccountEntity[] = foundPotentialReceivers.potentialReceivers;
  const donorName: string = _donationHelper.donorName(donation);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      potentialReceivers,
      `Donation Available From ${donorName}`,
      'donation-match-request',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      potentialReceivers,
      {
        notificationType: NotificationType.Donate,
        notificationLink: `/donation/details/${donation.id}`,
        title: 'Donation Available',
        icon: donation.donorAccount.profileImgUrl,
        body: `
          New donation from <strong>${donorName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  await Promise.all(messagePromises);
}
