import { AccountEntity } from '~entity';
import { AccountHelper, DateTimeHelper } from '~shared';
import { DonationHubPledgeEntity } from '~web/database/entity/donation-hub-pledge.entity';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';

const _accountHelper = new AccountHelper();
const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends donation drop-off pledge created message(s) to the owning volunteer.
 * @param pledge The donation drop-off pledge that has been newly created.
 * @return A promsie that resolves to the newly created donation drop-off pledge.
 */
export async function sendDonationHubPledgeCreateMessages(pledge: DonationHubPledgeEntity): Promise<DonationHubPledgeEntity> {
  const mailClient: MailClient = await getMailClient();
  const donationHub: DonationHubEntity = pledge.donationHub;
  const hubAccount: AccountEntity = donationHub.volunteerAccount;
  const hubAccountName: string = _accountHelper.accountName(hubAccount);
  const timezone: string = pledge.account.contactInfo.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);

  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    pledge.account,
    `Your Donation Pledge For ${dropOffWindowStartStr} Has Been Created`,
    'donation-hub-pledge-created',
    { donationHub, hubAccountName, pledge }
  ).catch(console.error);
  return pledge;
}