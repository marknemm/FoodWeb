import { EventRegistrationEntity } from '~entity';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';
import { DateTimeHelper } from '~shared';

const _dateTimeHelper = new DateTimeHelper();

export async function sendEventRegistrationMessage(eventRegistration: EventRegistrationEntity): Promise<void> {
  const mailClient: MailClient = await getMailClient();
  const eventDateStr: string = _dateTimeHelper.toLocalDateStr(eventRegistration.featuredEvent.date, eventRegistration.timezone);
  const eventTimeStr: string = _dateTimeHelper.toLocalTimeStr(eventRegistration.featuredEvent.date, eventRegistration.timezone);

  return mailClient.sendEmail(
    MailTransporter.NOREPLY,
    { name: eventRegistration.fullName, email: eventRegistration.email },
    `FoodWeb Event Registration Confirmation for: ${eventRegistration.featuredEvent.title}`,
    'event-registration',
    { eventRegistration, eventDateStr, eventTimeStr, featuredEvent: eventRegistration.featuredEvent }
  ).catch(console.error);
}
