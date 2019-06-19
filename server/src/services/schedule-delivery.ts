import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { MailTransporter, sendEmail, broadcastEmail } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { DonationEntity } from '../entity/donation.entity';
import { DeliveryEntity } from '../entity/delivery-entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { Account } from '../../../shared/src/interfaces/account/account';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DeliveryScheduleRequest } from '../../../shared/src/interfaces/delivery/delivery-schedule-request';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';

const _donationHelper = new DonationHelper();
const _deliveryHelper = new DeliveryHelper();

/**
 * Sends messages to potential volunteer deliverers so that they are notified about the need for donation delivery.
 * @param donation The donation that has been matched and needs to be delivered.
 * @return A promise that resolves to void when the operation is finished.
 */
export async function messagePotentialDeliverers(donation: Donation): Promise<void> {
  const potentialDeliverers: AccountEntity[] = await _findPotentialDeliverers();
  const messagePromises: Promise<void>[] = [];
  potentialDeliverers.forEach((deliverer: AccountEntity) => {
    const promise: Promise<void> = _sendDeliveryRequestMessages(donation, deliverer);
    messagePromises.push(promise);
  });
  await Promise.all(messagePromises).catch(console.error);
}

/**
 * Gets all potential deliverers for a donation so that they can be messaged for a chance to begin/schedule the delivery.
 * @return A promise that resolves to the list of potential receiver accounts.
 */
async function _findPotentialDeliverers(): Promise<AccountEntity[]> {
  const readRequest: AccountReadRequest = { page: 1, limit: 300, accountType: 'Volunteer' };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest);
  return queryResult.accounts;
}

/**
 * Messages a potential deliverer so that they may be aware of a newly matched donation that needs to be delivered.
 * @param donation The new donation.
 * @param receiver The deliverer account.
 * @return A promise that resolves to void once the email has been sent.
 */
function _sendDeliveryRequestMessages(donation: Donation, deliverer: AccountEntity): Promise<void> {
  return sendEmail(
    MailTransporter.NOREPLY,
    deliverer,
    `Delivery Requested from ${donation.donorAccount.organization.organizationName} to ${donation.receiverAccount.organization.organizationName}`,
    'delivery-request',
    { donation }
  );
}

export async function scheduleDelivery(scheduleRequest: DeliveryScheduleRequest, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(scheduleRequest.donationId);
  _ensureCanScheduleDelivery(donation, myAccount);
  donation.donationStatus = 'Scheduled';
  donation.delivery = _genDelivery(myAccount, donation, scheduleRequest);

  const scheduledDonation: Donation = await getConnection().transaction(
    async (manager: EntityManager) => manager.getRepository(DonationEntity).save(donation)
  );
  delete scheduledDonation.delivery['donation']; // Prevent circular JSON reference error.
  await _sendDeliveryScheduledMessages(scheduledDonation);

  return scheduledDonation;
}

function _ensureCanScheduleDelivery(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery scheduling failed: ${errMsg}`);
  }
}

function _genDelivery(myAccount: AccountEntity, donation: DonationEntity, scheduleRequest: DeliveryScheduleRequest): DeliveryEntity {
  return {
    id: undefined,
    volunteerAccount: myAccount,
    pickupWindowStart: scheduleRequest.pickupWindow.startDateTime,
    pickupWindowEnd: scheduleRequest.pickupWindow.endDateTime,
    donation
  };
}

async function _sendDeliveryScheduledMessages(donation: Donation): Promise<void> {
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

