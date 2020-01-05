#!/usr/bin/env node
require('./jobs-config');
import { SelectQueryBuilder } from 'typeorm';
import { AccountEntity, AccountType } from '../entity/account.entity';
import { DonationClaimEntity } from '../entity/donation-claim.entity';
import { DonationEntity, DonationStatus } from '../entity/donation.entity';
import { initDbConnectionPool } from '../helpers/db-connection-pool';
import { MailTransporter, sendEmail, genDonationEmailSubject } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { QueryResult } from '../helpers/query-builder-helper';
import { claimDonation } from '../services/claim-donation';
import { findMessagePotentialDeliverers } from '../services/find-message-potential-deliverers';
import { queryAccounts } from '../services/read-accounts';
import { queryDonations } from '../services/read-donations';
import { AccountReadRequest, DonationHelper, DonationReadRequest } from '../shared';

const _donationHelper = new DonationHelper();

_autoAssignDonations()
  .then(() => process.exit())
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });

/**
 * Automatically claims all donations that are to occur within 1/6 of the duration of time between donation creation
 * and the start of the pickup window, or donations that have less than 1 hour left until the start of the pickup window.
 * @return A promise that resolves once the operation is finished.
 */
async function _autoAssignDonations(): Promise<void> {
  await initDbConnectionPool();
  const limit = 300;
  let page = 1;
  let totalDonations = (limit * page) + 1; // +1 to trigger first loop.

  while (page * limit < totalDonations) {
    const readRequest: DonationReadRequest = {
      page: page++,
      limit,
      donationStatus: DonationStatus.Unmatched
    };
    const queryResult: QueryResult<DonationEntity> = await queryDonations(readRequest)
      .modQuery(_addElapsedTimeFilter);
    await _autoAssignReceivers(queryResult.entities);
    totalDonations = queryResult.totalCount;
  }
}

/**
 * Adds an elapsed time filter to a given DonationEntity select query builder.
 * The filter will only select donations that have a pickup window start time within one hour of the current time,
 * or have had 80% of the duration of time between donation creation and pickup window start elapsed.
 * @param queryBuilder The select query builder to add the filter to.
 */
function _addElapsedTimeFilter(queryBuilder: SelectQueryBuilder<DonationEntity>): void {
  queryBuilder = queryBuilder.andWhere(`(
    EXTRACT(EPOCH FROM (donation.pickupWindowStart - now()))::DECIMAL <= 3600000
    OR (
      EXTRACT(EPOCH FROM (now() - donation.createTimestamp))::DECIMAL
      / ABS(EXTRACT(EPOCH FROM (donation.pickupWindowStart - donation.createTimestamp)))::DECIMAL
      >= 0.8
    )
  )`);
}

/**
 * Auto-assigns given donations to available receivers.
 * @param donations The donations to auto-assign to receivers.
 * @return A promise that resolves to void once the operation finishes.
 */
async function _autoAssignReceivers(donations: DonationEntity[]): Promise<void> {
  const messagePromises: Promise<void>[] = [];
  for (let donation of donations) {
    const receiverAccount: AccountEntity = await _findAutoReceiver(donation);
    if (receiverAccount) {
      donation = await claimDonation({ donationId: donation.id }, receiverAccount);
      messagePromises.push(findMessagePotentialDeliverers(donation));
      messagePromises.push(_sendDonationAutoAssignMessages(donation));
    }
  }
  await Promise.all(messagePromises);
}

/**
 * Finds an automatic receiver for a given donation.
 * @param donation The donation to find an automatic receiver for.
 * @return A promise that resolves to the found automatic receiver. Will return null/undefined if no receiver is found.
 */
async function _findAutoReceiver(donation: DonationEntity): Promise<AccountEntity> {
  const readRequest: AccountReadRequest = {
    page: 1,
    limit: 1,
    accountType: AccountType.Receiver,
    autoReceiver: true,
    distanceRangeMi: 20,
    lon: donation.donorContactOverride.location.coordinates[0],
    lat: donation.donorContactOverride.location.coordinates[1],
    operationHoursRange: {
      startDateTime: donation.pickupWindowStart,
      endDateTime: donation.pickupWindowEnd
    }
  };
  const queryResult: QueryResult<AccountEntity> = await queryAccounts(readRequest, donation.donorAccount)
    .modQuery((queryBuilder: SelectQueryBuilder<AccountEntity>) => {
      // Override ORDER BY clause to sort receivers by the number of donations that they have received (in ASC order).
      // We want to auto-assign donations to receivers that have gotten the fewest donations thus-far.
      queryBuilder.addSelect((subQueryBuilder: SelectQueryBuilder<DonationEntity>) => {
          subQueryBuilder.select('COUNT(donation.id)', 'received_donations_count')
            .from(DonationClaimEntity, 'claim')
            .where('claim.receiverAccount = account.id');
          return subQueryBuilder;
        }, 'received_donations_count')
        .orderBy('received_donations_count', 'ASC');
    });
  return queryResult.entities[0];
}

/**
 * Sends donation auto-assign/claim messages to the donation's receiver and donor.
 * @param donation The donation that was auto-assigned.
 * @return A promise that resolves when the operation finishes.
 */
async function _sendDonationAutoAssignMessages(donation: DonationEntity): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const { donorName, receiverName } = _donationHelper.memberNames(donation);
  const extraVars: any = { donation, donorName, receiverName };
  const donationEmailSubject: string = genDonationEmailSubject(donation);

  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount,
      donationEmailSubject,
      'donation-claimed',
      extraVars
    ).catch(console.error)
  );

  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.claim.receiverAccount,
      donationEmailSubject,
      'donation-assigned',
      extraVars
    ).catch(console.error)
  )

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Donation Claimed`,
        icon: donation.claim.receiverAccount.profileImgUrl,
        body: `
          Donation claimed by <strong>${receiverName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.claim.receiverAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: `Auto-Assigned Donation`,
        icon: donation.donorAccount.profileImgUrl,
        body: `
          Auto-Assigned Donation from <strong>${donorName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
