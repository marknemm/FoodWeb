import { MailTransporter, sendEmail, broadcastEmail } from '../helpers/email';
import { AccountEntity } from '../entity/account.entity';
import { DonationHelper, Donation } from '../../../shared/src/helpers/donation-helper';
import { Account } from '../../../shared/src/interfaces/account/account';

const _donationHelper = new DonationHelper();

/**
 * Messages a potential deliverer so that they may be aware of a newly matched donation that needs to be delivered.
 * @param donation The new donation.
 * @param receiver The deliverer account.
 * @return A promise that resolves to void once the email has been sent.
 */
export function sendDeliveryRequestMessages(donation: Donation, deliverer: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    deliverer,
    `Delivery Requested from ${donation.donorAccount.organization.organizationName} to ${donation.receiverAccount.organization.organizationName}`,
    'delivery-request',
    { donation }
  );
}

export async function sendDeliveryScheduledMessages(donation: Donation): Promise<void> {
  const sendAccounts: Account[] = [donation.donorAccount, donation.receiverAccount, donation.delivery.volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const sendHeaders = [
    `Donation Delivery Scheduled for pickup by ${delivererName}`,
    `Donation Delivery Scheduled for drop-off by ${delivererName}`,
    `Delivery Successfully Scheduled from ${donorName} to ${receiverName}`
  ];

  await broadcastEmail(
    MailTransporter.NOREPLY,
    sendAccounts,
    sendHeaders,
    'delivery-scheduled',
    { donation, donorName, receiverName, delivererName }
  ).catch(console.error);
}
