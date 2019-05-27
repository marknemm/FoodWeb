import { getConnection, EntityManager } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { readAccounts, AccountsQueryResult } from './read-accounts';
import { sendEmail, MailTransporter } from '../helpers/email';
import { FoodWebError } from '../helpers/food-web-error';
import { readDonation } from './read-donations';
import { DonationEntity } from '../entity/donation.entity';
import { DeliveryEntity } from '../entity/delivery-entity';
import { Donation } from '../../../shared/src/interfaces/donation/donation';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DeliveryHelper } from '../../../shared/src/helpers/delivery-helper';

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
  await Promise.all(messagePromises);
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
    deliverer.contactInfo.email,
    `Delivery Requested from ${donation.donorAccount.organization.organizationName} to ${donation.receiverAccount.organization.organizationName}`,
    'delivery-request',
    deliverer,
    { donation }
  );
}

export async function scheduleDelivery(donationId: number, myAccount: AccountEntity): Promise<Donation> {
  const donation = <DonationEntity> await readDonation(donationId);
  _ensureCanScheduleDelivery(donation, myAccount);
  donation.donationStatus = 'Scheduled';
  donation.delivery = _genDelivery(myAccount, donation);

  let scheduledDonation: Donation;
  await getConnection().transaction(async (manager: EntityManager) => {
    scheduledDonation = await manager.getRepository(DonationEntity).save(donation);
    delete scheduledDonation.delivery['donation']; // Prevent circular JSON reference error.
    // await _sendDeliveryScheduledMessages(scheduledDonation);
  });
  return scheduledDonation;
}

function _ensureCanScheduleDelivery(donation: Donation, myAccount: AccountEntity): void {
  const errMsg: string = _deliveryHelper.validateDeliverySchedulePrivilege(donation.donationStatus, myAccount);
  if (errMsg) {
    throw new FoodWebError(`Delivery scheduling failed: ${errMsg}`);
  }
}

function _genDelivery(myAccount: AccountEntity, donation: DonationEntity): DeliveryEntity {
  return { id: undefined, volunteerAccount: myAccount, donation };
}

async function _sendDeliveryScheduledMessages(donation: Donation): Promise<void> {
  const sendPromises: Promise<void>[] = [];

  // Send receiver message.
  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.receiverAccount.contactInfo.email,
      `Claimed Donation From ${donation.donorAccount.organization.organizationName}`,
      'donation-claim-success',
      donation.receiverAccount,
      { donation }
    )
  );

  // Send donor message.
  sendPromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount.contactInfo.email,
      `Donation Claimed By ${donation.receiverAccount.organization.organizationName}`,
      'donation-claimed-by',
      donation.donorAccount,
      { donation }
    )
  );

  await Promise.all(sendPromises);
}

