import { UpdateDiff } from '../interfaces/update-diff';
import { broadcastEmail, MailTransporter, sendEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { pushNotification } from '../helpers/push-notification';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';
import { NotificationType } from '../../../shared/src/interfaces/notification/notification';

const _donationHelper = new DonationHelper();

/**
 * Messages a potential receiver so that they may be aware of a new donation and potentially claim it.
 * @param donation The new donation.
 * @param receiver The receiver account.
 * @return A promise that resolves to void once all messages have been sent.
 */
export async function sendMatchRequestMessage(donation: Donation, receiver: AccountEntity): Promise<void> {
  const messagePromises: Promise<void>[] = [];
  messagePromises.push(sendEmail(
    MailTransporter.NOREPLY,
    receiver,
    `Donation Available From ${_donationHelper.donorName(donation)}`,
    'donation-match-request',
    { donation }
  ));

  pushNotification(
    receiver,
    {
      notificationType: NotificationType.Donate,
      notificationDetailId: donation.id,
      notificationTitle: `Donation Available from ${_donationHelper.donorName(donation)}`,
      notificationBody: 'Select this notification to see more about the available donation'
    }
  );

  await Promise.all(messagePromises);
}

/**
 * Sends donation claimed messages to the donor and receiver users that are associated with the claimed donation.
 * @param donation The donation that has been claimed.
 * @return A promise that resolves to the newly claimed donation.
 */
export async function sendClaimMessages(donation: Donation): Promise<Donation> {
  const accounts: Account[] = [donation.receiverAccount, donation.donorAccount];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const subjects = [
    `Claimed Donation from ${donorName}`,
    `Donation Claimed by ${receiverName}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-claimed',
    { donation, donorName, receiverName }
  ).catch(console.error);
  return donation;
}

/**
 * Sends donation claimed messages to all accounts associated with the unclaimed donation (donor, receiver, & possibly volunteer).
 * @param unclaimDiff The diff of the unclaimed (new) and claimed (old) donation.
 * @return A promise that resolves to the (new) donation that has been unclaimed.
 */
export async function sendUnclaimMessages(unclaimDiff: UpdateDiff<Donation>): Promise<Donation> {
  const accounts: Account[] = [unclaimDiff.old.receiverAccount, unclaimDiff.new.donorAccount];
  const donorName: string = _donationHelper.donorName(unclaimDiff.new);
  const receiverName: string = _donationHelper.receiverName(unclaimDiff.old);
  let delivererName = '';
  const subjects = [
    `Unclaimed Donation from ${donorName}`,
    `Donation Unclaimed by ${receiverName}`
  ];

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (unclaimDiff.old.delivery) {
    accounts.push(unclaimDiff.old.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(unclaimDiff.old);
    subjects.push(`Delivery Cancelled by ${receiverName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-unclaimed',
    {
      donation: unclaimDiff.new,
      donorName,
      receiverName,
      delivererName,
      receiverAccount: unclaimDiff.old.receiverAccount
    }
  ).catch(console.error);

  return unclaimDiff.new;
}
