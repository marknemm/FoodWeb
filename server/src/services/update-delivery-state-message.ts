import { sendDeliveryCancelledMessages } from './cancel-delivery-message';
import { UpdateDiff } from '../interfaces/update-diff';
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { MailTransporter, broadcastEmail } from '../helpers/email';
import { broadcastNotification, NotificationType } from '../helpers/push-notification';
import { DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

/**
 * Sends delivery state advanced messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state advanced.
 * @return A promise that resolves to the given donation.
 */
export async function sendDeliveryStateAdvancedMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donation.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const advanceAction: string = (donation.donationStatus === 'Picked Up' ? 'Picked Up' : 'Completed');
  const emailTmpl: string = (donation.donationStatus === 'Picked Up' ? 'delivery-picked-up' : 'delivery-complete');
  const deliveryAction = `Delivery Has Been ${advanceAction} by ${delivererName}`;
  const emailSubjects = [
    deliveryAction,
    deliveryAction,
    `Delivery from ${donorName} to ${receiverName} Status Updated to ${donation.donationStatus}`
  ];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      emailSubjects,
      emailTmpl,
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.DeliveryStateAdvance,
        notificationDetailId: donation.id,
        notificationLink: `/donation-details/${donation.id}`,
        notificationTitle: `Delivery ${advanceAction}`,
        notificationIconUrl: volunteerAccount.profileImgUrl,
        notificationBody: `
          Delivery Has Been <strong>${advanceAction}</strong> by <strong>${delivererName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  await Promise.all(messagePromises);
  return donation;
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * If the delivery state is changed from scheduled to unscheduled, then delivery cancellation messages are sent.
 * @param undoDiff The donation delivery state undo diff.
 * @return A promise that resolves to the updated (new) donation with its delivery state undone.
 */
export async function sendDeliveryStateUndoMessages(undoDiff: UpdateDiff<DonationEntity>): Promise<DonationEntity> {
  return (undoDiff.new.donationStatus === DonationStatus.Matched)
    ? sendDeliveryCancelledMessages(undoDiff)
    : _sendDeliveryStateUndoMessages(undoDiff.new);
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state undone.
 * @return A promise that resolves to the given donation.
 */
async function _sendDeliveryStateUndoMessages(donation: DonationEntity): Promise<DonationEntity> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donation.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const deliveryAction = `Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}`;
  const emailSubjects = [
    deliveryAction,
    deliveryAction,
    `Delivery from ${donorName} to ${receiverName} Status Reverted to ${donation.donationStatus}`
  ];

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      emailSubjects,
      'delivery-status-undo',
      { donation, donorName, receiverName, delivererName }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.DeliveryStateUndo,
        notificationDetailId: donation.id,
        notificationLink: `/donation-details/${donation.id}`,
        notificationTitle: `Delivery Reverted to ${donation.donationStatus}`,
        notificationIconUrl: volunteerAccount.profileImgUrl,
        notificationBody: `
          Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  return donation;
}
