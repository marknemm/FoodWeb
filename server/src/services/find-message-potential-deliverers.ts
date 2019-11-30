import { AccountEntity } from '../entity/account.entity';
import { broadcastEmail, MailTransporter } from '../helpers/email';
import { broadcastNotification } from '../helpers/notification';
import { QueryResult } from '../helpers/query-builder-helper';
import { AccountReadRequest, AccountType, Donation, DonationHelper, NotificationType } from '../shared';
import { readAccounts } from './read-accounts';

const _donationHelper = new DonationHelper();

/**
 * Gets all potential deliverers for a donation and messages them so that they can be notified of the new delivery.
 * @return A promise that resolves when the operation has completed.
 */
export async function findMessagePotentialDeliverers(donation: Donation): Promise<void> {
  const limit = 300;
  let page = 1;
  let numQueried: number;

  do {
    const readRequest: AccountReadRequest = {
      page: page++,
      limit,
      accountType: AccountType.Volunteer,
      distanceRangeMi: 20,
      operationHoursRange: {
        startDateTime: donation.pickupWindowStart,
        endDateTime: donation.pickupWindowEnd
      }
    };
    const queryResult: QueryResult<AccountEntity> = await readAccounts(readRequest, donation.receiverAccount);
    numQueried = queryResult.entities.length;
    return _messagePotentialDeliverers(donation, queryResult.entities);
  } while (numQueried === limit);
}

/**
 * Messages a potential deliverer so that they may be aware of a newly matched donation that needs to be delivered.
 * @param donation The donation that is to be delivered.
 * @param potentialDeliverers The accounts of potential deliverers that are to be messaged/notified.
 * @return A promise that resolves to void once all messages/notifications have been sent.
 */
async function _messagePotentialDeliverers(donation: Donation, potentialDeliverers: AccountEntity[]): Promise<void> {
  const messagePromises: Promise<any>[] = [];
  const donorName: string = _donationHelper.donorName(donation);
  const receiverName: string = _donationHelper.receiverName(donation);
  // Filter for accounts that have notifications enabled for each (new) delivery/donation.
  const externalNotifyAccounts: AccountEntity[] = potentialDeliverers.filter(
    (account: AccountEntity) => account.contactInfo.notifyForEachDonation
  );

  messagePromises.push(
    broadcastEmail(
      MailTransporter.NOREPLY,
      externalNotifyAccounts,
      `
        Delivery Requested from ${donation.donorAccount.organization.organizationName}
        to ${donation.receiverAccount.organization.organizationName}
      `,
      'delivery-request',
      { donation }
    )
  );

  messagePromises.push(
    broadcastNotification(
      externalNotifyAccounts,
      {
        notificationType: NotificationType.ClaimDonation,
        notificationLink: `/donation/details/${donation.id}`,
        title: 'Delivery Requested',
        icon: donation.donorAccount.profileImgUrl,
        body: `
          Delivery requested from <strong>${donorName}</strong> to <strong>${receiverName}</strong>.
        `
      }
    )
  );

  await Promise.all(messagePromises);
}
