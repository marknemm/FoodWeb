import { sendDeliveryCancelledMessages } from './cancel-delivery-message';
import { UpdateDiff } from '../interfaces/update-diff';
import { MailTransporter, broadcastEmail } from '../helpers/email';
import { Donation, DonationStatus } from '../../../shared/src/interfaces/donation/donation';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

/**
 * Sends delivery state advanced messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state advanced.
 * @return A promise that resolves to the given donation.
 */
export async function sendDeliveryStateAdvancedMessages(donation: Donation): Promise<Donation> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const advanceAction: string = (donation.donationStatus === 'Picked Up' ? 'Picked Up' : 'Completed');
  const emailTmpl: string = (donation.donationStatus === 'Picked Up' ? 'delivery-picked-up' : 'delivery-complete');
  const sendSubjects = [
    `Delivery Has Been ${advanceAction} by ${delivererName}`,
    `Delivery Has Been ${advanceAction} by ${delivererName}`,
    `Delivery from ${donorName} to ${receiverName} Status Updated to ${donation.donationStatus}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    emailTmpl,
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);

  return donation;
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * If the delivery state is changed from scheduled to unscheduled, then delivery cancellation messages are sent.
 * @param undoDiff The donation delivery state undo diff.
 * @return A promise that resolves to the updated (new) donation with its delivery state undone.
 */
export async function sendDeliveryStateUndoMessages(undoDiff: UpdateDiff<Donation>): Promise<Donation> {
  return (undoDiff.new.donationStatus === DonationStatus.Matched)
    ? sendDeliveryCancelledMessages(undoDiff)
    : _sendDeliveryStateUndoMessages(undoDiff.new);
}

/**
 * Sends delivery state undo messages to each user associated with the given donation (donor, receiver, & volunteer).
 * @param donation The donation that has had its delivery state undone.
 * @return A promise that resolves to the given donation.
 */
async function _sendDeliveryStateUndoMessages(donation: Donation): Promise<Donation> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const sendSubjects = [
    `Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}`,
    `Delivery Status has been reverted to ${donation.donationStatus} by ${delivererName}`,
    `Delivery from ${donorName} to ${receiverName} Status Reverted to ${donation.donationStatus}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    'delivery-status-undo',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);

  return donation;
}
