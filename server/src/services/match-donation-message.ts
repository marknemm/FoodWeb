import { getConnection, Not } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { ClaimReqHistoryEntity } from '../entity/claim-req-history.entity';
import { DonationEntity } from '../entity/donation.entity';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { UpdateDiff } from '../interfaces/update-diff';
import { DonationHelper } from '../shared';

const _donationHelper = new DonationHelper();

/**
 * Sends donation claimed messages to the donor and receiver users that are associated with the claimed donation.
 * @param donation The donation that has been claimed.
 * @return A promise that resolves to the newly claimed donation.
 */
export async function sendClaimMessages(donation: DonationEntity): Promise<DonationEntity> {
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
    _findMessageClaimReqRecipients(donation)
  );

  return donation;
}

/**
 * Finds and messages the recipients of a given donation's message for potential receivers.
 * Notifies these receivers that the donation has been claimed, and is no longer available.
 * @param donation The donation.
 * @return A promise that resolves once the operation completes.
 */
async function _findMessageClaimReqRecipients(donation: DonationEntity): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const histories: ClaimReqHistoryEntity[] = await getConnection().getRepository(ClaimReqHistoryEntity).find({
      skip: (page++ - 1) * limit,
      take: limit,
      where: { donation, receiverAccount: Not(donation.claim.receiverAccount.id) }
    });
    numQueried = histories.length;
    const recipients: AccountEntity[] = histories.map(
      (history: ClaimReqHistoryEntity) => history.receiverAccount
    );
    await _messageClaimReqRecipients(donation, recipients);
  } while (numQueried === limit);

  // Cleanup claim request history items that are no longer needed.
  await getConnection().getRepository(ClaimReqHistoryEntity).delete({ donation: donation });
}

/**
 * Messages the recipients of a given donation's message for potential receivers.
 * Notifies these receivers that the donation has been claimed, and is no longer available.
 * @param donation The donation.
 * @param recipients The recipients that are to be notified.
 * @return A promise that resolves once the operation completes.
 */
async function _messageClaimReqRecipients(donation: DonationEntity, recipients: AccountEntity[]): Promise<void> {
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      recipients,
      genDonationEmailSubject(donation),
      'donation-claimed-other',
      { donation, donorName, receiverName }
    )
  );

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation No Longer Available`,
        icon: donation.claim.receiverAccount.profileImgUrl,
        body: `
          Donation claimed by <strong>${receiverName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}

/**
 * Sends donation claimed messages to all accounts associated with the unclaimed donation (donor, receiver, & possibly volunteer).
 * @param unclaimDiff The diff of the unclaimed (new) and claimed (old) donation.
 * @return A promise that resolves to the (new) donation that has been unclaimed.
 */
export async function sendUnclaimMessages(unclaimDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const emailAccounts: AccountEntity[] = [unclaimDiff.old.claim.receiverAccount, unclaimDiff.new.donorAccount];
  const donorName: string = _donationHelper.donorName(unclaimDiff.new);
  const receiverName: string = _donationHelper.receiverName(unclaimDiff.old);
  let delivererName = '';

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (unclaimDiff.old.delivery) {
    emailAccounts.push(unclaimDiff.old.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(unclaimDiff.old);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    emailAccounts,
    genDonationEmailSubject(unclaimDiff.new),
    'donation-unclaimed',
    {
      donation: unclaimDiff.new,
      donorName,
      receiverName,
      delivererName,
      receiverAccount: unclaimDiff.old.claim.receiverAccount
    }
  ).catch(console.error);

  messagePromises.push(
    sendNotification(
      unclaimDiff.new.donorAccount,
      {
        notificationType: NotificationType.UnclaimDonation,
        notificationLink: `/donation/details/${unclaimDiff.new.id}`,
        title: `Donation Unclaimed`,
        icon: unclaimDiff.old.claim.receiverAccount.profileImgUrl,
        body: `
          Donation unclaimed by <strong>${receiverName}</strong>.<br>
          <i>${unclaimDiff.new.description}</i>
        `
      }
    ).catch(console.error)
  );

  if (unclaimDiff.old.delivery) {
    messagePromises.push(
      sendNotification(
        unclaimDiff.old.delivery.volunteerAccount,
        {
          notificationType: NotificationType.UnclaimDonation,
          notificationLink: `/donation/details/${unclaimDiff.new.id}`,
          title: `Donation Unclaimed`,
          icon: unclaimDiff.old.claim.receiverAccount.profileImgUrl,
          body: `
            Delivery Cancelled by <strong>${receiverName}</strong>.<br>
            <i>${unclaimDiff.new.description}</i>
          `
        }
      ).catch(console.error)
    );
  }

  await Promise.all(messagePromises);
  return unclaimDiff.new;
}
