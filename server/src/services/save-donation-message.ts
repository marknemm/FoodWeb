import { MailTransporter, sendEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { Donation } from '../../../shared/src/helpers/donation-helper';

export function sendDonationCreateSuccessEmail(donation: Donation, account: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    account,
    'Donation Successful',
    'donation-create-success',
    { donation }
  ).catch(console.error);
}

export function sendDonationUpdateSuccessEmails(originalDonation: Donation, updatedDonation: Donation): Promise<void> {
  // Send e-mail to donorAccount linked directly to the donation.
  return sendEmail(
    MailTransporter.NOREPLY,
    updatedDonation.donorAccount,
    'Donation Update Successful',
    'donation-update-success',
    { originalDonation, updatedDonation }
  ).catch(console.error);
}
