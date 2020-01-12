import { Not } from 'typeorm';
import { AccountEntity } from '../../entity/account.entity';
import { ClaimReqHistoryEntity } from '../../entity/claim-req-history.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { getOrmRepository, OrmEntityManager, OrmRepository } from '../../helpers/database/orm';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../../helpers/messaging/email';
import { broadcastNotification } from '../../helpers/messaging/notification';
import { DonationHelper, NotificationType } from '../../shared';

const _donationHelper = new DonationHelper();

/**
 * Sends claim unavailable messages for a given donation that has either been claimed or deleted.
 * The messages will be sent to all user's that were previously sent message(s) giving them the opportunity to claim the donation.
 * @param donation The donation.
 * @param manager The optional Entity Manager used to encompase all internal database writes within a transaction.
 * @return A promise that resolves once the operation completes.
 */
export async function sendClaimUnavailableMessages(donation: DonationEntity, manager?: OrmEntityManager): Promise<void> {
  const claimReqHistoryRepo: OrmRepository<ClaimReqHistoryEntity> = (manager)
    ? manager.getRepository(ClaimReqHistoryEntity)
    : getOrmRepository(ClaimReqHistoryEntity);
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const histories: ClaimReqHistoryEntity[] = await claimReqHistoryRepo.find({
      skip: (page++ - 1) * limit,
      take: limit,
      where: (donation.claim)
        ? { donation, receiverAccount: Not(donation.claim.receiverAccount.id) }
        : { donation }
    });
    numQueried = histories.length;
    const recipients: AccountEntity[] = histories.map(
      (history: ClaimReqHistoryEntity) => history.receiverAccount
    );
    if (recipients?.length) {
      await _sendMessageToRecipients(donation, recipients);
    }
  } while (numQueried === limit);

  // Cleanup claim request history items that are no longer needed.
  await claimReqHistoryRepo.delete({ donation });
}

/**
 * Sends claim unavailable messages for a given donation that has either been claimed or deleted.
 * The messages will be sent to all user's that were previously sent message(s) giving them the opportunity to claim the donation.
 * @param donation The donation.
 * @param recipients The recipients that are to be notified.
 * @return A promise that resolves once the operation completes.
 */
async function _sendMessageToRecipients(donation: DonationEntity, recipients: AccountEntity[]): Promise<void> {
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      recipients,
      genDonationEmailSubject(donation),
      'donation-claim-unavailable',
      { donation, donorName, receiverName }
    )
  );

  messagePromises.push(
    broadcastNotification(
      recipients,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation No Longer Available`,
        icon: donation.donorAccount.profileImgUrl,
        body: `
          Donation has either been claimed or deleted:<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
