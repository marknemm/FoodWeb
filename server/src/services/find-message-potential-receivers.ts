import { EntityManager, getConnection } from 'typeorm';
import { AccountEntity } from '../entity/account.entity';
import { ClaimReqHistoryEntity } from '../entity/claim-req-history.entity';
import { DonationEntity } from '../entity/donation.entity';
import { broadcastEmail, genDonationEmailSubject, MailTransporter } from '../helpers/email';
import { broadcastNotification } from '../helpers/notification';
import { QueryResult } from '../helpers/query-builder-helper';
import { AccountReadRequest, AccountType, DonationHelper, NotificationType } from '../shared';
import { readAccounts } from './read-accounts';

const _donationHelper = new DonationHelper();

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves once the operation has finished.
 */
export async function findMessagePotentialReceivers(donation: DonationEntity): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const readRequest: AccountReadRequest = {
      page: page++,
      limit,
      accountType: AccountType.Receiver,
      distanceRangeMi: 20,
      lon: donation.donorContactOverride.location.coordinates[0],
      lat: donation.donorContactOverride.location.coordinates[1],
      operationHoursRange: {
        startDateTime: donation.pickupWindowStart,
        endDateTime: donation.pickupWindowEnd
      }
    };
    const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, donation.donorAccount);
    numQueried = queryResult.entities.length;
    await _messagePotentialReceivers(donation, queryResult.entities);
  } while (numQueried === limit);
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
      'donation-match-request',
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
