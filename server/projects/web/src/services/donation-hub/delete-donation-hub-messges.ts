import { AccountEntity } from '~entity';
import { AccountHelper, DateTimeHelper, ListResponse } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient, NotificationType } from '~web/helpers/messaging/notification';
import { readDonationHubPledges } from '../donation-hub-pledge/read-donation-hub-pledges';

const _accountHelper = new AccountHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends donation hub delete messages/notifications to the owner of the donation hub, and all
 * volunteers who have pledged a donation to that hub.
 * @param donationHub The donation hub that is to be deleted.
 * @return A promise that resolves once all messages have been sent.
 */
export async function sendDonationHubDeleteMessages(donationHub: DonationHubEntity): Promise<void> {
  const messagePromises: Promise<void>[] = [];
  if (!donationHub) { return; }

  messagePromises.push(
    _sendDeleteMessageToHubOwner(donationHub)
  );
  messagePromises.push(
    _sendDeleteMessagesToPledgers(donationHub)
  );

  await Promise.all(messagePromises);
}

/**
 * Sends donation hub delete messages/notifications to the owner of the donation hub.
 * @param donationHub The donation hub that is to be deleted.
 * @return A promise that resolves once all messages have been sent.
 */
async function _sendDeleteMessageToHubOwner(donationHub: DonationHubEntity): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);

  messagePromises.push(
    mailClient.sendEmail(
      MailTransporter.NOREPLY,
      hubAccount,
      `Your Donation Drop-Off Hub For ${dropOffWindowStartStr} Has Been Deleted`,
      'donation-hub-deleted',
      { donationHub, hubAccountName, isHubAccount: true }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      hubAccount,
      {
        notificationType: NotificationType.DonationHubReminder,
        notificationLink: `donation-hub/create`,
        title: 'Donation Drop-Off Hub Deleted',
        body: `
          Your doantion drop-off hub for <strong>${dropOffWindowStartStr}</strong> has been deleted.
          Click this notification to register another drop-off hub.
        `
      }
    ).catch(console.error)
  );
}

/**
 * Sends donation hub delete messages/notifications to the volunteers who have pledged a donation to the hub.
 * @param donationHub The donation hub that is to be deleted.
 * @return A promise that resolves once all messages have been sent.
 */
async function _sendDeleteMessagesToPledgers(donationHub: DonationHubEntity): Promise<void> {
  const limit = 300;
  let page = 1;
  let totalPledges = (limit * page) + 1; // +1 to trigger first loop.

  while (page * limit < totalPledges) {
    const listRes: ListResponse<DonationHubPledgeEntity> = await readDonationHubPledges({
      donationHubId: donationHub.id, page: page++, limit
    });
    totalPledges = listRes.totalCount;
    await _sendDeleteMessageBatchToPledgers(listRes.list, donationHub);
  }
}

/**
 * Sends donation hub delete messages/notifications to a batch of queried volunteers who have pledged a donation to the hub.
 * @param pledges The batch of queried pledges associated with the donation hub that is to be deleted.
 * @param donationHub The donation hub that is to be deleted.
 * @return A promise that resolves once all messages have been sent.
 */
async function _sendDeleteMessageBatchToPledgers(pledges: DonationHubPledgeEntity[], donationHub: DonationHubEntity): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const messagePromises: Promise<any>[] = [];
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);

  for (const pledge of pledges) {
    const pledgeAccount: AccountEntity = pledge.account;

    messagePromises.push(
      mailClient.sendEmail(
        MailTransporter.NOREPLY,
        pledgeAccount,
        `Donation Drop-Off Hub Deleted - Your Pledge For ${dropOffWindowStartStr} Has Been Cancelled`,
        'donation-hub-deleted',
        { donationHub, hubAccountName, pledge, isPledgeAccount: true }
      ).catch(console.error)
    );

    messagePromises.push(
      notificationClient.sendNotification(
        pledgeAccount,
        {
          notificationType: NotificationType.DonationHubReminder,
          notificationLink: `donation-hub/list`,
          title: 'Donation Pledge Cancelled',
          body: `
            Donation drop-off hub deleted - your pledge For <strong>${dropOffWindowStartStr}</strong> has been cancelled.
            Click this notification to pledge your donation to another hub.
          `
        }
      ).catch(console.error)
    );
  }

  await Promise.all(messagePromises);
}
