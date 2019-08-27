import { FoundPotentialDeliverers } from './find-potential-deliverers';
import { MailTransporter, broadcastEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { broadcastNotification, NotificationType } from '../helpers/push-notification';
import { Donation, DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

/**
 * Messages a potential deliverer so that they may be aware of a newly matched donation that needs to be delivered.
 * @param foundPotentialDeliverers The potential deliverers that are to be messaged.
 * @return A promise that resolves to void once the email has been sent.
 */
export async function messagePotentialDeliverers(foundPotentialDeliverers: FoundPotentialDeliverers): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donation: Donation = foundPotentialDeliverers.donation;
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const potentialDeliverers: AccountEntity[] = foundPotentialDeliverers.potentialDeliverers;

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      potentialDeliverers,
      `
        Delivery Requested from ${donation.donorAccount.organization.organizationName}
        to ${donation.receiverAccount.organization.organizationName}
      `,
      'delivery-request',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      potentialDeliverers,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationDetailId: donation.id,
        notificationLink: `/donation-details/${donation.id}`,
        notificationTitle: 'Delivery Requested',
        notificationIconUrl: donation.donorAccount.profileImgUrl,
        notificationBody: `
          Delivery requested from <strong>${donorName}</strong> to <strong>${receiverName}</strong>.
        `
      }
    )
  );

  await Promise.all(messagePromises);
}
