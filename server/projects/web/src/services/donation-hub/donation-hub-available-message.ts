import { AccountEntity } from '~entity';
import { AccountHelper, AccountReadRequest, AccountType, DateTimeHelper, ListResponse, NotificationType, OperationHours, OperationHoursHelper } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient } from '~web/helpers/messaging/notification';
import { readAccounts } from '../account/read-accounts';

const _accountHelper = new AccountHelper();
const _dateTimeHelper = new DateTimeHelper();
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
      distanceRangeMi: 8,
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
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartDateStr: string = _dateTimeHelper.toLocalDateStr(donationHub.dropOffWindowStart, timezone);
  const dropOffWindowStartTimeStr: string = _dateTimeHelper.toLocalTimeStr(donationHub.dropOffWindowStart, timezone);
  // Filter for accounts that have notifications enabled for each (new) donation hub registration.
  const notifyAccounts: AccountEntity[] = potentialPledgers.filter(
    (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  );

  messagePromises.push(
    mailClient.broadcastEmail(
      MailTransporter.NOREPLY,
      notifyAccounts,
      `Donation Drop-Off Hub Available on ${dropOffWindowStartDateStr} at ${dropOffWindowStartTimeStr}`,
      'donation-hub-available',
      { donationHub, hubAccountName }
    )
  );

  messagePromises.push(
    notificationClient.broadcastNotification(
      notifyAccounts,
      {
        notificationType: NotificationType.DonationHubAvailable,
        notificationLink: `/donation-hub/${donationHub.id}`,
        title: 'Donation Drop-Off Hub Available',
        icon: donationHub.volunteerAccount.profileImg,
        body: `New donation drop-off hub hosted by <strong>${hubAccountName}</strong> available`
            + ` on <strong>${dropOffWindowStartDateStr}</strong> at <strong>${dropOffWindowStartTimeStr}</strong>.`
      }
    )
  );

  await Promise.all(messagePromises);
}
