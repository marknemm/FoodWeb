#!/usr/bin/env node
require('./jobs-config');
import { SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '~entity';
import { initOrm } from '~orm';
import { AccountHelper, DateTimeHelper, ListResponse, NotificationType } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient } from '~web/helpers/messaging/notification';
import { readDonationHubPledges } from '~web/services/donation-hub-pledge/read-donation-hub-pledges';
import { queryDonationHubs } from '~web/services/donation-hub/read-donation-hubs';

const _accountHelper = new AccountHelper();
const _dateTimeHelper = new DateTimeHelper();
const _reminderIntervalMins = 10; // Job will be scheduled to run every 10 minutes.

_sendDonationHubReminders()
  .then(() => process.exit())
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });

/**
 * Notifies all individuals associated with a donation hub that its drop-off window is starting in the next 24 hours and hour.
 * @return A promise that resolves to void when the operation finishes.
 */
async function _sendDonationHubReminders(): Promise<void> {
  await initOrm();
  for (const hour of [1, 24]) {
    const dateRoundedToInterval: Date = _dateTimeHelper.roundNearestMinutes(new Date(), _reminderIntervalMins);
    const earliestDropOffWindowStart: Date = _dateTimeHelper.addHours(dateRoundedToInterval, hour);
    const latestDropOffWindowStart: Date = _dateTimeHelper.addMinutes(earliestDropOffWindowStart, _reminderIntervalMins);
    const limit = 300;
    let page = 1;
    let totalDonationHubs = (limit * page) + 1; // +1 to trigger first loop.

    while (page * limit < totalDonationHubs) {
      const listRes: ListResponse<DonationHubEntity> = await queryDonationHubs({ page: page++, limit }).modQuery(
        (queryBuilder: SelectQueryBuilder<DonationHubEntity>) =>
          queryBuilder.andWhere('donationHub.dropOffWindowStart >= :earliestDropOffWindowStart', { earliestDropOffWindowStart })
                      .andWhere('donationHub.dropOffWindowStart <= :latestDropOffWindowStart', { latestDropOffWindowStart })
      ).exec();
      totalDonationHubs = listRes.totalCount;
      await _sendDonationHubMessageBatch(listRes.list, hour);
    }
  }
}

async function _sendDonationHubMessageBatch(donationHubs: DonationHubEntity[], hour: number): Promise<void> {
  const messagePromises: Promise<void>[] = [];

  donationHubs.forEach((donationHub: DonationHubEntity) => {
    messagePromises.push(
      _sendDonationHubMessage(donationHub, hour)
    );

    messagePromises.push(
      _sendDonationPledgeReminders(donationHub)
    );
  });

  await Promise.all(messagePromises); // Wait to complete batch before loading more data.
}

async function _sendDonationHubMessage(donationHub: DonationHubEntity, hour: number): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);
  const dropOffTimeStartStr: string = _dateTimeHelper.toLocalTimeStr(donationHub.dropOffWindowStart, timezone);
  const dropOffTimeEndStr: string = _dateTimeHelper.toLocalTimeStr(donationHub.dropOffWindowEnd, timezone);

  messagePromises.push(
    mailClient.sendEmail(
      MailTransporter.NOREPLY,
      hubAccount,
      `Donation Hub Drop-Off Window Reminder for ${dropOffWindowStartStr}`,
      'donation-hub-reminder',
      { donationHub, hubAccountName, hour, isHubAccount: true }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      hubAccount,
      {
        notificationType: NotificationType.DonationHubReminder,
        notificationLink: `donation-hub/${donationHub.id}`,
        title: 'Donation Hub Reminder',
        body: `
          Your donation hub's drop off window will begin ${hour === 24 ? 'tomorrow' : 'today'} between:
          <br><strong>${dropOffTimeStartStr}</strong> - <strong>${dropOffTimeEndStr}</strong>
        `
      }
    ).catch (console.error)
  );

  await Promise.all(messagePromises);
}

async function _sendDonationPledgeReminders(donationHub: DonationHubEntity): Promise<void> {
  for (const hour of [1, 24]) {
    const limit = 300;
    let page = 1;
    let totalPledges = (limit * page) + 1; // +1 to trigger first loop.

    while (page * limit < totalPledges) {
      const listRes: ListResponse<DonationHubPledgeEntity> = await readDonationHubPledges({
        donationHubId: donationHub.id, page: page++, limit
      });
      totalPledges = listRes.totalCount;
      await _sendDonationPledgeMessageBatch(listRes.list, donationHub, hour);
    }
  }
}

async function _sendDonationPledgeMessageBatch(donationPledges: DonationHubPledgeEntity[], donationHub: DonationHubEntity, hour: number) {
  const messagePromises: Promise<void>[] = [];

  donationPledges.forEach((donationPledge: DonationHubPledgeEntity) => {
    donationPledge.donationHub = donationHub;
    messagePromises.push(
      _sendDonationPledgeMessage(donationPledge, hour)
    );
  });

  await Promise.all(messagePromises); // Wait to complete batch before loading more data.
}

async function _sendDonationPledgeMessage(pledge: DonationHubPledgeEntity, hour: number) {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const donationHub: DonationHubEntity = pledge.donationHub;
  const messagePromises: Promise<any>[] = [];
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const pledgeAccount: AccountEntity = pledge.account;
  const pledgeAccountName: string = _accountHelper.accountName(pledgeAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);
  const dropOffTimeStartStr: string = _dateTimeHelper.toLocalTimeStr(donationHub.dropOffWindowStart, timezone);
  const dropOffTimeEndStr: string = _dateTimeHelper.toLocalTimeStr(donationHub.dropOffWindowEnd, timezone);

  messagePromises.push(
    mailClient.sendEmail(
      MailTransporter.NOREPLY,
      hubAccount,
      `Donation Pledge Drop-Off Window Reminder for ${dropOffWindowStartStr}`,
      'donation-hub-reminder',
      { donationHub, hubAccountName, pledge, pledgeAccountName, hour, isHubAccount: false }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      hubAccount,
      {
        notificationType: NotificationType.DonationHubReminder,
        notificationLink: `donation-hub/${donationHub.id}`,
        title: 'Donation Hub Reminder',
        body: `
          Your donation pledge's drop off window will begin ${hour === 24 ? 'tomorrow' : 'today'} between:
          <br><strong>${dropOffTimeStartStr}</strong> - <strong>${dropOffTimeEndStr}</strong>
        `
      }
    ).catch (console.error)
  );

  await Promise.all(messagePromises);
}
