import { AccountEntity } from '~entity';
import { AccountReadRequest, AccountType, ListResponse, OperationHours, OperationHoursHelper } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient } from '~web/helpers/messaging/notification';
import { readAccounts } from '../account/read-accounts';

const _operationHoursHelper = new OperationHoursHelper();

/**
 * Notify volunteer donors that a donation hub near them has been created.
 * @param donation The donation hub that is newly available.
 * @return A promise that resolves to the available donation hub once completed.
 */
 export async function sendDonationHubAvailableMessages(donationHub: DonationHubEntity): Promise<DonationHubEntity> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const operationHours: OperationHours = _operationHoursHelper.dateTimeRangeToOperationHours(
      { startDateTime: donationHub.dropOffWindowStart, endDateTime: donationHub.dropOffWindowEnd },
      donationHub.volunteerAccount.contactInfo.timezone
    );
    const readRequest: AccountReadRequest = {
      page: page++,
      limit,
      accountType: AccountType.Volunteer,
      distanceRangeMi: 20,
      lon: donationHub.contactOverride.location.coordinates[0],
      lat: donationHub.contactOverride.location.coordinates[1],
      operationHoursWeekday: operationHours.weekday,
      operationHoursStartTime: operationHours.startTime,
      operationHoursEndTime: operationHours.endTime
    };
    const listRes: ListResponse<AccountEntity> = await readAccounts(readRequest, donationHub.volunteerAccount);
    numQueried = listRes.list.length;
    await _messagePotentialPledgers(donationHub, listRes.list);
  } while (numQueried === limit);

  return donationHub;
}

/**
 * Messages potential volunteer pledgers so that they may be aware of a new donation hub and pledge donations to it.
 * @param donation The new donation hub that volunteers may pledge donations to.
 * @param potentialPledgers The accounts of volunteers that are to be messaged/notified.
 * @return A promise that resolves to void once all messages/notifications have been sent.
 */
 async function _messagePotentialPledgers(donationHub: DonationHubEntity, potentialPledgers: AccountEntity[]): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  // const donorName: string = _donationHelper.donorName(donation);
  // Filter for accounts that have notifications enabled for each (new) donation.
  // const notifyAccounts: AccountEntity[] = potentialPledgers.filter(
  //   (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  // );

  // messagePromises.push(
  //   mailClient.broadcastEmail(
  //     MailTransporter.NOREPLY,
  //     notifyAccounts,
  //     _donationHelper.genDonationEmailSubject(donation),
  //     'donation-hub-available',
  //     { donationHub }
  //   )
  // );

  // messagePromises.push(
  //   notificationClient.broadcastNotification(
  //     notifyAccounts,
  //     {
  //       notificationType: NotificationType.Donate,
  //       notificationLink: `/donation/${donation.id}`,
  //       title: 'Donation Available',
  //       icon: donation.donorAccount.profileImg,
  //       body: `
  //         New donation from <strong>${donorName}</strong>.<br>
  //         <i>${donation.description}</i>
  //       `
  //     }
  //   )
  // );

  // messagePromises.push(
  //   _saveClaimReqHistories(donation, notifyAccounts)
  // );

  await Promise.all(messagePromises);
}

/**
 * Saves histories of claim request messages that have been sent out for a given donation to a given list of (receiver) accounts.
 * NOTE: This is used later on to re-message all receivers so that they may know that the donation has been claimed.
 * @param donation The donation for which the claim request history is being created.
 * @param accounts The (receiver) accounts that have received the claim request message(s).
 * @return A promise that resolves once all histories have been saved.
 */
// async function _saveClaimReqHistories(donation: DonationEntity, accounts: AccountEntity[]): Promise<void> {
//   const claimReqHistories: ClaimReqHistoryEntity[] = accounts.map((receiverAccount: AccountEntity) =>
//     ({ id: undefined, donation, receiverAccount })
//   );
//   return getConnection().transaction(async (manager: EntityManager) => {
//     await manager.getRepository(ClaimReqHistoryEntity).save(claimReqHistories);
//   });
// }
