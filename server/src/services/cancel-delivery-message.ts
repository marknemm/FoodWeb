import { broadcastEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { UpdateDiff } from '../interfaces/update-diff';
import { broadcastNotification, NotificationType } from '../helpers/push-notification';
import { AccountEntity } from '../entity/account.entity';
import { DonationEntity } from '../entity/donation.entity';

const _donationHelper = new DonationHelper();

/**
 * Sends delivery cancelled messages to each user associated with a donation (donor, receiver, & volunteer).
 * @param unscheduleDiff The diff of unscheduled and scheduled donations.
 * @return A promise that resolves to the unscheduled (new) donation.
 */
export async function sendDeliveryCancelledMessages(unscheduleDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = unscheduleDiff.old.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [unscheduleDiff.new.donorAccount, unscheduleDiff.new.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [unscheduleDiff.new.donorAccount, unscheduleDiff.new.receiverAccount];
  const donorName: string = _donationHelper.donorName(unscheduleDiff.new);
  const receiverName: string = _donationHelper.receiverName(unscheduleDiff.new);
  const delivererName: string = _donationHelper.delivererName(unscheduleDiff.old);
  const emailSubjects = [
    `Donation Delivery Cancelled by ${delivererName}`,
    `Donation Delivery Cancelled by ${delivererName}`,
    `Delivery Successfully Cancelled from ${donorName} to ${receiverName}`
  ];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      emailSubjects,
      'delivery-cancelled',
      { donation: unscheduleDiff.new, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.CancelDelivery,
        notificationDetailId: unscheduleDiff.new.id,
        notificationLink: `donation/details/${unscheduleDiff.new.id}`,
        notificationTitle: 'Delivery Cancelled',
        notificationIconUrl: volunteerAccount.profileImgUrl,
        notificationBody: `
          Donation delivery cancelled by <strong>${delivererName}</strong>.<br>
          <i>${unscheduleDiff.new.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
  return unscheduleDiff.new;
}
