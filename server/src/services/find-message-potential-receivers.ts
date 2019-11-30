import { AccountEntity } from '../entity/account.entity';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { broadcastNotification } from '../helpers/notification';
import { QueryResult } from '../helpers/query-builder-helper';
import { AccountReadRequest, AccountType, Donation, DonationHelper, NotificationType } from '../shared';
import { readAccounts } from './read-accounts';

const _donationHelper = new DonationHelper();

/**
 * Sends messages to potential receiver charities so that they are given a chance to claim the donation.
 * @param donation The donation that is up for claim.
 * @return A promise that resolves once the operation has finished.
 */
export async function findMessagePotentialReceivers(donation: Donation): Promise<void> {
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
async function _messagePotentialReceivers(donation: Donation, potentialReceivers: AccountEntity[]): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donorName: string = _donationHelper.donorName(donation);
  // Filter for accounts that have notifications enabled for each (new) donation.
  const externalNotifyAccounts: AccountEntity[] = potentialReceivers.filter(
    (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  );

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      externalNotifyAccounts,
      `Donation Available From ${donorName}`,
      'donation-match-request',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      externalNotifyAccounts,
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

  await Promise.all(messagePromises);
}
