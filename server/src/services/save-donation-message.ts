import { genDonationEmailSubject, MailTransporter, sendEmail } from '../helpers/email';
import { UpdateDiff } from '../interfaces/update-diff';
import { Donation } from '../shared';

/**
 * Sends donation created message(s) to the donor.
 * @param donation The donation that has been newly created.
 * @return A promsie that resolves to the newly created donation.
 */
export async function sendDonationCreateMessages(donation: Donation): Promise<Donation> {
  sendEmail(
    MailTransporter.NOREPLY,
    donation.donorAccount,
    genDonationEmailSubject(donation),
    'donation-create-success',
    { donation }
  ).catch(console.error);
  return donation;
}

/**
 * Sends donation updated message(s) to the donor.
 * @param donationDiff The donation update diff containing the new and old donation.
 * @return The updated (new) donation.
 */
export async function sendDonationUpdateMessages(donationDiff: UpdateDiff<Donation>): Promise<Donation> {
  // Send e-mail to donorAccount linked directly to the donation.
  await sendEmail(
    MailTransporter.NOREPLY,
    donationDiff.new.donorAccount,
    genDonationEmailSubject(donationDiff.new),
    'donation-update-success',
    {
      originalDonation: donationDiff.old,
      updatedDonation: donationDiff.new
    }
  ).catch(console.error);
  return donationDiff.new;
}
