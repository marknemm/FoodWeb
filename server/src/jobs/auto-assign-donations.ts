#!/usr/bin/env node
require('./jobs-config');
import { DonationEntity, DonationStatus } from '../entity/donation.entity';
import { AccountEntity, AccountType } from '../entity/account.entity';
import { AccountsQueryResult, readAccounts } from '../services/read-accounts';
import { readDonations, DonationsQueryResult } from '../services/read-donations';
import { claimDonation } from '../services/match-donation';
import { findPotentialDeliverers, FoundPotentialDeliverers } from '../services/find-potential-deliverers';
import { messagePotentialDeliverers } from '../services/message-potential-deliverers';
import { initDbConnectionPool } from '../helpers/db-connection-pool';
import { MailTransporter, sendEmail } from '../helpers/email';
import { NotificationType, sendNotification } from '../helpers/notification';
import { DonationReadRequest } from '../../../shared/src/interfaces/donation/donation-read-request';
import { AccountReadRequest } from '../../../shared/src/interfaces/account/account-read-request';
import { DonationHelper } from '../../../shared/src/helpers/donation-helper';

const _donationHelper = new DonationHelper();

_autoAssignDonations()
  .then(() => process.exit())
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });

/**
 * Automatically claims all donations that are to occur within 1/6 of the duration of time between donation creation
 * and the start of the pickup window.
 * @return A promise that resolves to void once the operation is finished.
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
      donationStatus: DonationStatus.Unmatched,
      remainingTimeRatioUntilDelivery: 0.2
    };
    const queryResult: DonationsQueryResult = await readDonations(readRequest);
    await _autoAssignReceivers(queryResult.donations);
    totalDonations = queryResult.totalCount;
  }
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
      const foundDeliverers: FoundPotentialDeliverers = await findPotentialDeliverers(donation);
      messagePromises.push(messagePotentialDeliverers(foundDeliverers));
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
    },
    sortNumAssociatedDonations: 'ASC'
  };
  const queryResult: AccountsQueryResult = await readAccounts(readRequest, donation.donorAccount);
  return queryResult.accounts[0];
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

  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.donorAccount,
      `Donation Claimed by ${receiverName}`,
      'donation-claimed',
      extraVars
    ).catch(console.error)
  );

  messagePromises.push(
    sendEmail(
      MailTransporter.NOREPLY,
      donation.receiverAccount,
      `Auto-Assigned Donation from ${donorName}`,
      'donation-assigned',
      extraVars
    ).catch(console.error)
  )

  messagePromises.push(
    sendNotification(
      donation.donorAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationDetailId: donation.id,
        notificationLink: `/donation/details/${donation.id}`,
        notificationTitle: `Donation Claimed`,
        notificationIconUrl: donation.receiverAccount.profileImgUrl,
        notificationBody: `
          Donation claimed by <strong>${receiverName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  messagePromises.push(
    sendNotification(
      donation.receiverAccount,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationDetailId: donation.id,
        notificationLink: `/donation/details/${donation.id}`,
        notificationTitle: `Auto-Assigned Donation`,
        notificationIconUrl: donation.donorAccount.profileImgUrl,
        notificationBody: `
          Auto-Assigned Donation from <strong>${donorName}</strong>.<br>
          <i>${donation.description}</i>
        `
      }
    ).catch(console.error)
  );

  await Promise.all(messagePromises);
}
