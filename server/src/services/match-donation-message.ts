import { UpdateDiff } from '../interfaces/update-diff';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

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
