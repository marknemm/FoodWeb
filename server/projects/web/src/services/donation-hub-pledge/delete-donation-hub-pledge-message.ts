import { AccountEntity } from '~entity';
import { AccountHelper, DateTimeHelper, NotificationType } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { getNotificationClient, NotificationClient } from '~web/helpers/messaging/notification';

const _accountHelper = new AccountHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends donation drop-off pledge delete message(s) to the owning volunteer.
 * @param pledge The donation drop-off pledge that has been deleted.
 * @return A promise that resolves to deleted donation drop-off pledge.
 */
export async function sendDonationHubPledgeDeleteMessages(pledge: DonationHubPledgeEntity): Promise<DonationHubPledgeEntity> {
  const mailClient: MailClient = await getMailClient();
  const notificationClient: NotificationClient = getNotificationClient();

  const donationHub: DonationHubEntity = pledge.donationHub;
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const pledgeAccount: AccountEntity = pledge.account;
  const pledgeAccountName: string = _accountHelper.accountName(pledgeAccount);
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);
  const messagePromises: Promise<any>[] = [];

  messagePromises.push(
    mailClient.sendEmail(
      MailTransporter.NOREPLY,
      pledge.account,
      `Your Donation Pledge For ${dropOffWindowStartStr} Has Been Deleted`,
      'donation-hub-pledge-deleted',
      { donationHub, hubAccountName, pledge }
    ).catch(console.error)
  );

  messagePromises.push(
    notificationClient.sendNotification(
      hubAccount,
      {
        notificationType: NotificationType.DonationPledgeRemoved,
        notificationLink: `/donation-hub/${donationHub.id}`,
        title: `Donation Pledge Removed`,
        icon: pledgeAccount.profileImg,
        body: `
          Donation pledge removed by <strong>${pledgeAccountName}</strong>:<br>
          <i>${pledge.foodType} (count: ${pledge.foodCount})</i>
        `
      }
    ).catch(console.error)
  );

  return Promise.all(messagePromises).then(() => pledge);
}
