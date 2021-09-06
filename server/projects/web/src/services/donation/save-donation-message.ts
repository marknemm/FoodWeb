import { Donation, DonationHelper } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { UpdateDiff } from '~web/helpers/misc/update-diff';

const _donationHelper = new DonationHelper();

/**
 * Sends donation created message(s) to the donor.
 * @param donation The donation that has been newly created.
 * @return A promise that resolves to the newly created donation.
 */
export async function sendDonationCreateMessages(donation: Donation): Promise<Donation> {
  const mailClient: MailClient = await getMailClient();
  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    donation.donorAccount,
    _donationHelper.genDonationEmailSubject(donation),
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
  const mailClient: MailClient = await getMailClient();
  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    donationDiff.new.donorAccount,
    _donationHelper.genDonationEmailSubject(donationDiff.new),
    'donation-update-success',
    {
      originalDonation: donationDiff.old,
      updatedDonation: donationDiff.new
    }
  ).catch(console.error);
  return donationDiff.new;
}
