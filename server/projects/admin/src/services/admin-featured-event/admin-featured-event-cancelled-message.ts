import { FeaturedEventEntity } from '~entity';
import { DateTimeHelper } from '~shared';
import { getMailClient, MailClient, MailTransporter } from '~web/helpers/messaging/email';

const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends featured event cancellation messages for a given featured event.
 * @param featuredEvent The featured event that was cancelled.
 * @return A promise that resolves once all messages have been sent.
 */
export async function adminSendFeaturedEventCancelledMessages(featuredEvent: FeaturedEventEntity): Promise<any> {
  const promises: Promise<void>[] = [];
  const mailClient: MailClient = await getMailClient();

  for (const eventRegistration of featuredEvent.registrations) {
    const eventDateStr: string = _dateTimeHelper.toLocalDateStr(featuredEvent.date, eventRegistration.timezone);
    const eventTimeStr: string = _dateTimeHelper.toLocalTimeStr(featuredEvent.date, eventRegistration.timezone);

    promises.push(
      mailClient.sendEmail(
        MailTransporter.NOREPLY,
        { name: eventRegistration.fullName, email: eventRegistration.email },
        `FoodWeb Event Cancelled: ${featuredEvent.title}`,
        'featured-event-cancelled',
        { eventRegistration, eventDateStr, eventTimeStr, featuredEvent }
      ).catch(console.error)
    );
  }

  return Promise.all(promises);
}
