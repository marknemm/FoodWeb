import { getConnection, Not } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { DeliveryReqHistoryEntity } from '../entity/delivery-req-history.entity';
import { DonationEntity } from '../entity/donation.entity';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { Donation, DonationHelper } from '../shared';

const _donationHelper = new DonationHelper();

export async function sendDeliveryScheduledMessages(donation: DonationEntity): Promise<Donation> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, donation.delivery.volunteerAccount];
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

  messagePromises.push(
    _findMessageDeliveryReqRecipients(donation)
  );

  await Promise.all(messagePromises);
  return donation;
}

/**
 * Finds and messages the recipients of a given donation's message for potential deliverers.
 * Notifies these deliverers that the donation has been scheduled for delivery, and is no longer available.
 * @param donation The donation.
 * @return A promise that resolves once the operation completes.
 */
async function _findMessageDeliveryReqRecipients(donation: DonationEntity): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const histories: DeliveryReqHistoryEntity[] = await getConnection().getRepository(DeliveryReqHistoryEntity).find({
      skip: (page++ - 1) * limit,
      take: limit,
      where: { donation, volunteerAccount: Not(donation.delivery.volunteerAccount.id) }
    });
    numQueried = histories.length;
    const recipients: AccountEntity[] = histories.map(
      (history: DeliveryReqHistoryEntity) => history.volunteerAccount
    );
    await _messageDeliveryReqRecipients(donation, recipients);
  } while (numQueried === limit);

  // Cleanup delivery request history items that are no longer needed.
  await getConnection().getRepository(DeliveryReqHistoryEntity).delete({ donation: donation });
}

/**
 * Messages the recipients of a given donation's message for potential deliverers.
 * Notifies these deliverers that the donation has been scheduled for delivery, and is no longer available.
 * @param donation The donation.
 * @param recipients The recipients that are to be notified.
 * @return A promise that resolves once the operation completes.
 */
async function _messageDeliveryReqRecipients(donation: DonationEntity, recipients: AccountEntity[]): Promise<void> {
  const { donorName, receiverName, delivererName } = _donationHelper.memberNames(donation);
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      recipients,
      genDonationEmailSubject(donation),
      'delivery-scheduled-other',
      { donation, donorName, receiverName, delivererName }
    )
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Delivery No Longer Available`,
        icon: donation.donorAccount.profileImgUrl,
        body: `
          Delivery scheduled by another volunteer:<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
