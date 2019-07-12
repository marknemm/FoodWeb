import { broadcastEmail, MailTransporter } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

export async function sendDeliveryCancelledMessage(donation: Donation, myAccount: AccountEntity): Promise<void> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, myAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = `${myAccount.volunteer.firstName} ${myAccount.volunteer.lastName}`;
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
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
