import { Not } from 'typeorm';
import { AccountEntity, DeliveryReqHistoryEntity, DonationEntity } from '~entity';
import { getOrmRepository, OrmEntityManager, OrmRepository } from '~orm';
import { DonationHelper, NotificationType } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient } from '~web/helpers/messaging/notification';

const _donationHelper = new DonationHelper();

/**
 * Sends delivery unavailable messages for a given donation that has either been scheduled for delivery, unclaimed, or deleted.
 * The messages will be sent to all user's that were previously sent message(s) giving them the opportunity to schedule a
 * delivery for the donation.
 * @param donation The donation.
 * @param manager The optional Entity Manager used to encompase all internal database writes within a transaction.
 * @return A promise that resolves once the operation completes.
 */
export async function sendDeliveryUnavailableMessages(donation: DonationEntity, manager?: OrmEntityManager): Promise<void> {
  const deliveryReqHistoryRepo: OrmRepository<DeliveryReqHistoryEntity> = (manager)
    ? manager.getRepository(DeliveryReqHistoryEntity)
    : getOrmRepository(DeliveryReqHistoryEntity);
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const histories: DeliveryReqHistoryEntity[] = await deliveryReqHistoryRepo.find({
      skip: (page++ - 1) * limit,
      take: limit,
      where: (donation.claim.delivery)
        ? { donation, volunteerAccount: Not(donation.claim.delivery.volunteerAccount.id) }
        : { donation }
    });
    numQueried = histories.length;
    const recipients: AccountEntity[] = histories.map(
      (history: DeliveryReqHistoryEntity) => history.volunteerAccount
    );
    if (recipients?.length) {
      await _sendMessageToRecipients(donation, recipients);
    }
  } while (numQueried === limit);

  // Cleanup delivery request history items that are no longer needed.
  await deliveryReqHistoryRepo.delete({ donation });
}

/**
 * Sends delivery unavailable messages for a given donation that has either been scheduled for delivery, unclaimed, or deleted.
 * The messages will be sent to all user's that were previously sent message(s) giving them the opportunity to schedule a
 * delivery for the donation.
 * @param donation The donation.
 * @param recipients The recipients that are to be notified.
 * @return A promise that resolves once the operation completes.
 */
async function _sendMessageToRecipients(donation: DonationEntity, recipients: AccountEntity[]): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const { donorName, receiverName, delivererName } = _donationHelper.memberNames(donation);
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    mailClient.broadcastEmail(
      MailTransporter.NOREPLY,
      recipients,
      _donationHelper.genDonationEmailSubject(donation),
      'delivery-unavailable',
      { donation, donorName, receiverName, delivererName }
    )
  );

  messagePromises.push(
    notificationClient.broadcastNotification(
      recipients,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/delivery/${donation.id}`,
        title: `Delivery No Longer Available`,
        icon: donation.donorAccount.profileImg,
        body: `
          Delivery has either been scheduled or deleted:<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
