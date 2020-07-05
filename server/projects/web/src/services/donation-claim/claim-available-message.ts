import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity, ClaimReqHistoryEntity, DonationEntity } from '~entity';
import { QueryResult } from '~orm';
import { AccountReadRequest, AccountType, DonationHelper, NotificationType, OperationHours, OperationHoursHelper } from '~shared';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '~web/helpers/messaging/email';
import { broadcastNotification } from '~web/helpers/messaging/notification';
import { readAccounts } from '../account/read-accounts';

const _donationHelper = new DonationHelper();
const _operationHoursHelper = new OperationHoursHelper();

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves to the available donation once completed.
 */
export async function sendClaimAvailableMessages(donation: DonationEntity): Promise<DonationEntity> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const operationHours: OperationHours = _operationHoursHelper.genOperationHoursFilter(donation);
    const readRequest: AccountReadRequest = {
      page: page++,
      limit,
      accountType: AccountType.Receiver,
      distanceRangeMi: 20,
      lon: donation.donorContactOverride.location.coordinates[0],
      lat: donation.donorContactOverride.location.coordinates[1],
      operationHoursWeekday: operationHours.weekday,
      operationHoursStartTime: operationHours.startTime,
      operationHoursEndTime: operationHours.endTime
    };
    const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, donation.donorAccount);
    numQueried = queryResult.entities.length;
    await _messagePotentialReceivers(donation, queryResult.entities);
  } while (numQueried === limit);

  return donation;
}

/**
 * Messages potential receivers so that they may be aware of a new donation and potentially claim it.
 * @param donation The donation that is to be matched with a receiver.
 * @param potentialReceivers The accounts of potential receivers that are to be messaged/notified.
 * @return A promise that resolves to void once all messages/notifications have been sent.
 */
async function _messagePotentialReceivers(donation: DonationEntity, potentialReceivers: AccountEntity[]): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donorName: string = _donationHelper.donorName(donation);
  // Filter for accounts that have notifications enabled for each (new) donation.
  const notifyAccounts: AccountEntity[] = potentialReceivers.filter(
    (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  );

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      notifyAccounts,
      genDonationEmailSubject(donation),
      'donation-claim-available',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      notifyAccounts,
      {
        notificationType: NotificationType.Donate,
        notificationLink: `/donation/details/${donation.id}`,
        title: 'Donation Available',
        icon: donation.donorAccount.profileImgUrl,
        body: `
          New donation from <strong>${donorName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    )
  );

  messagePromises.push(
    _saveClaimReqHistories(donation, notifyAccounts)
  );

  await Promise.all(messagePromises);
}

/**
 * Saves histories of claim request messages that have been sent out for a given donation to a given list of (receiver) accounts.
 * NOTE: This is used later on to re-message all receivers so that they may know that the donation has been claimed.
 * @param donation The donation for which the claim request history is being created.
 * @param accounts The (receiver) accounts that have received the claim request message(s).
 * @return A promise that resolves once all histories have been saved.
 */
async function _saveClaimReqHistories(donation: DonationEntity, accounts: AccountEntity[]): Promise<void> {
  const claimReqHistories: ClaimReqHistoryEntity[] = accounts.map((receiverAccount: AccountEntity) =>
    ({ id: undefined, donation, receiverAccount })
  );
  return getConnection().transaction(async (manager: EntityManager) => {
    await manager.getRepository(ClaimReqHistoryEntity).save(claimReqHistories)
  });
}
