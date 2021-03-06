import { DateTimeHelper } from '~shared';
import { DonationHubEntity } from '~web/database/entity/donation-hub.entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';

const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends donation drop-off hub created message(s) to the owning volunteer.
 * @param donationHub The donation drop-off hub that has been newly created.
 * @return A promsie that resolves to the newly created donation drop-off hub.
 */
export async function sendDonationHubCreateMessages(donationHub: DonationHubEntity): Promise<DonationHubEntity> {
  const mailClient: MailClient = await getMailClient();
  const timezone: string = donationHub.contactOverride.timezone;
  const dropOffWindowStartStr: string = _dateTimeHelper.toLocalDateTimeStr(donationHub.dropOffWindowStart, timezone);

  await mailClient.sendEmail(
    MailTransporter.NOREPLY,
    donationHub.volunteerAccount,
    `Your Donation Drop-Off Hub For ${dropOffWindowStartStr} Has Been Created`,
    'donation-hub-created',
    { donationHub }
  ).catch(console.error);
  return donationHub;
}
