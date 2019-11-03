#!/usr/bin/env node
require('./jobs-config');
import { DonationEntity } from '../entity/donation.entity';
import { AccountEntity } from '../entity/account.entity';
import { readDonations, DonationsQueryResult } from '../services/read-donations';
import { initDbConnectionPool } from '../helpers/db-connection-pool';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { broadcastNotification, NotificationType } from '../helpers/notification';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { DateTimeHelper } from '../../../shared/src/helpers/date-time-helper';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _reminderIntervalMins = 10; // Job will be scheduled to run every 10 minutes.
const _dateTimeHelper = new DateTimeHelper();
const _donationHelper = new DonationHelper();

_sendDeliveryReminders()
  .then(() => process.exit())
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });

/**
 * Notifies all individuals associated with a donation that is to be delivered in the next hour and 24 hours.
 * @return A promise that resolves to void when the operation finishes.
 */
async function _sendDeliveryReminders(): Promise<void> {
  await initDbConnectionPool();
  for (const hour of [1, 24]) {
    const earliestDeliveryWindowStart: Date = _genEarliestDeliveryWindowStart(hour);
    const latestDeliveryWindowStart: Date = _genLatestDeliveryWindowStart(earliestDeliveryWindowStart);
    const limit = 300;
    let page = 1;
    let totalDonations = (limit * page) + 1; // +1 to trigger first loop.

    while (page * limit < totalDonations) {
      const readRequest: DonationReadRequest = {
        page: page++,
        limit,
        earliestDeliveryWindowStart,
        latestDeliveryWindowStart
      };
      const queryResult: DonationsQueryResult = await readDonations(readRequest);
      await _sendAllDeliveryReminderMessages(queryResult.donations, hour);
      totalDonations = queryResult.totalCount;
    }
  }
}

function _genEarliestDeliveryWindowStart(hour: number): Date {
  return _dateTimeHelper.addHours(
    _dateTimeHelper.roundNearestMinutes(new Date(), _reminderIntervalMins),
    hour
  );
}

function _genLatestDeliveryWindowStart(earliestDeliveryWindowStart: Date): Date {
  return _dateTimeHelper.addMinutes(earliestDeliveryWindowStart, _reminderIntervalMins);
}

async function _sendAllDeliveryReminderMessages(donations: DonationEntity[], hour: number): Promise<void> {
  const messagePromises: Promise<void>[] = [];
  donations.forEach((donation: DonationEntity) =>
    messagePromises.push(
      _sendDeliveryReminderMessages(donation, hour)
    )
  );
  await Promise.all(messagePromises);
}

async function _sendDeliveryReminderMessages(donation: DonationEntity, hour: number): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const volunteerAccount: AccountEntity = donation.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.receiverAccount, volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const timezone: string = donation.donorContactOverride.timezone;
  const deliveryWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donation.delivery.pickupWindowStart, timezone);
  const deliveryTimeStartStr: string = _dateTimeHelper.toLocalTimeStr(donation.delivery.pickupWindowStart, timezone);
  const deliveryTimeEndStr: string = _dateTimeHelper.toLocalTimeStr(donation.delivery.pickupWindowEnd, timezone);

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      emailAccounts,
      `Delivery Reminder for ${deliveryWindowStartStr}`,
      'delivery-reminder',
      { donation, donorName, receiverName, delivererName, hour }
    ).catch(console.error)
  );

  messagePromises.push(
    broadcastNotification(
      notificationAccounts,
      {
        notificationType: NotificationType.DeliveryReminder,
        notificationLink: `donation/details/${donation.id}`,
        title: 'Delivery Reminder',
        icon: volunteerAccount.profileImgUrl,
        body: `
          Delivery will occur ${hour === 24 ? 'tomorrow': 'today'} between:
          <br><strong>${deliveryTimeStartStr}</strong> - <strong>${deliveryTimeEndStr}</strong>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
