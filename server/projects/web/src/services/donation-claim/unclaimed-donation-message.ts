import { DonationEntity } from '~entity';
import { Account, DonationHelper, NotificationType } from '~shared';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '~web/helpers/messaging/email';
import { sendNotification } from '~web/helpers/messaging/notification';
import { UpdateDiff } from '~web/interfaces/update-diff';
import { sendDeliveryUnavailableMessages } from '../delivery/delivery-unavailable-message';

const _donationHelper = new DonationHelper();

/**
 * Sends donation claimed messages to all accounts associated with the unclaimed donation (donor, receiver, & possibly volunteer).
 * @param unclaimDiff The diff of the unclaimed (new) and claimed (old) donation.
 * @return A promise that resolves to the (new) donation that has been unclaimed.
 */
export async function sendUnclaimedDonationMessages(unclaimDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    _sendEmailToAllDonationAccounts(unclaimDiff)
  );

  messagePromises.push(
    _sendNotificationToDonor(unclaimDiff.old)
  );

  // If donation had a delivery, then notify deliverer of unclaim.
  // Else, message all previously messaged potential deliverers that delivery is no longer available.
  messagePromises.push(
    (unclaimDiff.old.claim.delivery)
      ? _sendNotificationToDeliverer(unclaimDiff.old)
      : sendDeliveryUnavailableMessages(unclaimDiff.old)
  );

  await Promise.all(messagePromises);
  return unclaimDiff.new;
}

/**
 * Sends donation unclaimed emails to all accounts associated with the donation.
 * @param unclaimDiff The unclaim donation update diff.
 * @return A promise that resolves once the operation completes.
 */
async function _sendEmailToAllDonationAccounts(unclaimDiff: UpdateDiff<DonationEntity>): Promise<void> {
  const donationAccounts: Account[] = _donationHelper.memberAccountsArr(unclaimDiff.old);
  const { donorName, receiverName, delivererName } = _donationHelper.memberNames(unclaimDiff.old);

  await broadcastEmail(
    MailTransporter.NOREPLY,
    donationAccounts,
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
}

/**
 * Sends a donation unclaimed notification to the donor for an unclaimed donation.
 * @param donation The donation, before it has been unclaimed.
 * @return A promise that resolves once the operation completes.
 */
async function _sendNotificationToDonor(donation: DonationEntity): Promise<void> {
  const receiverName: string = _donationHelper.receiverName(donation);
  await sendNotification(
    donation.donorAccount,
    {
      notificationType: NotificationType.UnclaimDonation,
      notificationLink: `/donation/details/${donation.id}`,
      title: `Donation Unclaimed`,
      icon: donation.claim.receiverAccount.profileImgUrl,
      body: `
        Donation unclaimed by <strong>${receiverName}</strong>.<br>
        <i>${donation.description}</i>
      `
    }
  ).catch(console.error)
}

/**
 * Sends a donation unclaimed (delivery cancelled) notification to the deliverer for an unclaimed donation.
 * @param donation The donation, before it has been unclaimed.
 * @return A promise that resolves once the operation completes.
 */
async function _sendNotificationToDeliverer(donation: DonationEntity): Promise<void> {
  const receiverName: string = _donationHelper.receiverName(donation);
  await sendNotification(
    donation.claim.delivery.volunteerAccount,
    {
      notificationType: NotificationType.UnclaimDonation,
      notificationLink: `/donation/details/${donation.id}`,
      title: `Donation Unclaimed`,
      icon: donation.claim.receiverAccount.profileImgUrl,
      body: `
        Delivery Cancelled by <strong>${receiverName}</strong>.<br>
        <i>${donation.description}</i>
      `
    }
  ).catch(console.error);
}
