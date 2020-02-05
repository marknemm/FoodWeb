import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../../entity/account.entity';
import { DeliveryReqHistoryEntity } from '../../entity/delivery-req-history.entity';
import { DonationEntity } from '../../entity/donation.entity';
import { QueryResult } from '../../helpers/database/query-builder-helper';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../../helpers/messaging/email';
import { broadcastNotification } from '../../helpers/messaging/notification';
import { AccountReadRequest, AccountType, DonationHelper, NotificationType } from '../../shared';
import { readAccounts } from '../account/read-accounts';

const _donationHelper = new DonationHelper();

/**
 * Gets all potential deliverers for a donation and messages them so that they can be notified of the new delivery.
 * @return A promise that resolves when the operation has completed.
 */
export async function sendDeliveryAvailableMessages(donation: DonationEntity): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const readRequest: AccountReadRequest = {
      page: page++,
      limit,
      accountType: AccountType.Volunteer,
      distanceRangeMi: 20,
      operationHoursRange: {
        startDateTime: donation.pickupWindowStart,
        endDateTime: donation.pickupWindowEnd
      }
    };
    const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, donation.claim.receiverAccount);
    numQueried = queryResult.entities.length;
    await _messagePotentialDeliverers(donation, queryResult.entities);
  } while (numQueried === limit);
}

/**
 * Messages a potential deliverer so that they may be aware of a newly matched donation that needs to be delivered.
 * @param donation The donation that is to be delivered.
 * @param potentialDeliverers The accounts of potential deliverers that are to be messaged/notified.
 * @return A promise that resolves to void once all messages/notifications have been sent.
 */
async function _messagePotentialDeliverers(donation: DonationEntity, potentialDeliverers: AccountEntity[]): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  // Filter for accounts that have notifications enabled for each (new) delivery/donation.
  const notifyAccounts: AccountEntity[] = potentialDeliverers.filter(
    (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  );

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      notifyAccounts,
      genDonationEmailSubject(donation),
      'delivery-available',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      notifyAccounts,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/delivery/details/${donation.id}`,
        title: 'Delivery Requested',
        icon: donation.donorAccount.profileImgUrl,
        body: `
          Delivery requested from <strong>${donorName}</strong> to <strong>${receiverName}</strong>.
        `
      }
    )
  );

  messagePromises.push(
    _saveDeliveryReqHistories(donation, notifyAccounts)
  );

  await Promise.all(messagePromises);
}

/**
 * Saves histories of delivery request messages that have been sent out for a given donation to a given list of (volunteer) accounts.
 * NOTE: This is used later on to re-message all volunteers so that they may know that the delivery has been scheduled.
 * @param donation The donation for which the delivery request history is being created.
 * @param accounts The (volunteer) accounts that have received the delivery request message(s).
 * @return A promise that resolves once all histories have been saved.
 */
async function _saveDeliveryReqHistories(donation: DonationEntity, accounts: AccountEntity[]): Promise<void> {
  const deliveryReqHistories: DeliveryReqHistoryEntity[] = accounts.map((volunteerAccount: AccountEntity) =>
    ({ id: undefined, donation, volunteerAccount })
  );
  return getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(DeliveryReqHistoryEntity).save(deliveryReqHistories)
  });
}