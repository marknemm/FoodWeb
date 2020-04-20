#!/usr/bin/env node
require('./jobs-config');
import { DateTimeHelper, DonationHelper } from '../../../shared/src/web';
import { AccountEntity, DonationEntity } from '../../database/src/entity';
import { initOrm, OrmSelectQueryBuilder, QueryResult } from '../../database/src/orm';
import { broadcastEmail, MailTransporter } from '../../projects/web/src/helpers/messaging/email';
import { broadcastNotification, NotificationType } from '../../projects/web/src/helpers/messaging/notification';
import { queryDonations } from '../../projects/web/src/services/donation/read-donations';

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
  await initOrm();
  for (const hour of [1, 24]) {
    const earliestDeliveryWindowStart: Date = _genEarliestDeliveryWindowStart(hour);
    const latestDeliveryWindowStart: Date = _genLatestDeliveryWindowStart(earliestDeliveryWindowStart);
    const limit = 300;
    let page = 1;
    let totalDonations = (limit * page) + 1; // +1 to trigger first loop.

    while (page * limit < totalDonations) {
      const queryResult: QueryResult<DonationEntity> = await queryDonations({ page: page++, limit }).modQuery(
        (queryBuilder: OrmSelectQueryBuilder<DonationEntity>) =>
          queryBuilder.andWhere('delivery.pickupWindowStart >= :earliestDeliveryWindowStart', { earliestDeliveryWindowStart })
                      .andWhere('delivery.pickupWindowStart <= :latestDeliveryWindowStart', { latestDeliveryWindowStart })
      ).exec();
      await _sendAllDeliveryReminderMessages(queryResult.entities, hour);
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
  const volunteerAccount: AccountEntity = donation.claim.delivery.volunteerAccount;
  const emailAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, volunteerAccount];
  const notificationAccounts: AccountEntity[] = [donation.donorAccount, donation.claim.receiverAccount, volunteerAccount];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  const delivererName: string = _donationHelper.delivererName(donation);
  const timezone: string = donation.donorContactOverride.timezone;
  const deliveryWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donation.claim.delivery.pickupWindowStart, timezone);
  const deliveryTimeStartStr: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.pickupWindowStart, timezone);
  const deliveryTimeEndStr: string = _dateTimeHelper.toLocalTimeStr(donation.claim.delivery.pickupWindowEnd, timezone);

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
        notificationLink: `delivery/details/${donation.id}`,
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
