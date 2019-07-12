import { MailTransporter, broadcastEmail } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

export async function sendDeliveryStateAdvancedMessage(donation: Donation): Promise<void> {
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
}

export async function sendDeliveryStateUndoMessage(donation: Donation): Promise<void> {
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
}
