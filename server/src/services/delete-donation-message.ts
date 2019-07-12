import { broadcastEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

export async function sendDonationDeleteSuccessEmail(donation: Donation): Promise<void> {
  const accounts: Account[] = [donation.donorAccount];
  const donorName: string = _donationHelper.donorName(donation);
  let receiverName = '';
  let delivererName = '';
  const subjects = ['Successfully Deleted Donation'];

  // If donation was claimed by a receiver, then we must also notify them.
  if (donation.receiverAccount) {
    accounts.push(donation.receiverAccount);
    receiverName = _donationHelper.receiverName(donation);
    subjects.push(`Claimed Donation Deleted by ${donorName}`);
  }

  // If donation had a delivery lined up, we must also notify the deliverer.
  if (donation.delivery) {
    accounts.push(donation.delivery.volunteerAccount);
    delivererName = _donationHelper.delivererName(donation);
    subjects.push(`Delivery Cancelled by ${donorName}`);
  }

  await broadcastEmail(
    MailTransporter.NOREPLY,
    accounts,
    subjects,
    'donation-deleted',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
