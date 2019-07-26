import { broadcastEmail, MailTransporter, sendEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';
import { pushNotification } from '../helpers/push-notification';

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
      notificationType: 'Donation Available',
      notificationDetailId: donation.id,
      notificationTitle: `Donation Available from ${_donationHelper.donorName(donation)}`,
      notificationBody: 'Select this notification to see more about the available donation'
    }
  );

  await Promise.all(messagePromises);
}

export async function sendClaimMessages(donation: Donation): Promise<void> {
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
}

export async function sendUnclaimMessages(unclaimedDonation: Donation, donationToUnclaim: Donation): Promise<void> {
  const accounts: Account[] = [donationToUnclaim.receiverAccount, unclaimedDonation.donorAccount];
  const donorName: string = _donationHelper.donorName(unclaimedDonation);
  const receiverName: string = _donationHelper.receiverName(donationToUnclaim);
  let delivererName = '';
  const subjects = [
    `Unclaimed Donation from ${donorName}`,
    `Donation Unclaimed by ${receiverName}`
  ];

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (donationToUnclaim.delivery) {
    accounts.push(donationToUnclaim.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(donationToUnclaim);
    subjects.push(`Delivery Cancelled by ${receiverName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-unclaimed',
    { donation: unclaimedDonation, donorName, receiverName, delivererName, receiverAccount: donationToUnclaim.receiverAccount }
  ).catch(console.error);
}
