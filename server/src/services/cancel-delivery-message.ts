import { broadcastEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';
import { UpdateDiff } from '../interfaces/update-diff';

const _donationHelper = new DonationHelper();

/**
 * Sends delivery cancelled messages to each user associated with a donation (donor, receiver, & volunteer).
 * @param unscheduleDiff The diff of unscheduled and scheduled donations.
 * @return A promise that resolves to the unscheduled (new) donation.
 */
export async function sendDeliveryCancelledMessages(unscheduleDiff: UpdateDiff<Donation>): Promise<Donation> {
  const volunteerAccount: Account = unscheduleDiff.old.delivery.volunteerAccount;
  const sendAccounts: Account[] = [unscheduleDiff.new.donorAccount, unscheduleDiff.new.receiverAccount, volunteerAccount];
  const donorName: string = _donationHelper.donorName(unscheduleDiff.new);
  const receiverName: string = _donationHelper.receiverName(unscheduleDiff.new);
  const delivererName: string = _donationHelper.delivererName(unscheduleDiff.old);
  const sendSubjects = [
    `Donation Delivery Cancelled by ${delivererName}`,
    `Donation Delivery Cancelled by ${delivererName}`,
    `Delivery Successfully Cancelled from ${donorName} to ${receiverName}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendSubjects,
    'delivery-cancelled',
    { donation: unscheduleDiff.new, donorName, receiverName, delivererName }
  ).catch(console.error);

  return unscheduleDiff.new;
}
