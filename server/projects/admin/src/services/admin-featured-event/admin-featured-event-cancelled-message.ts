import { EventRegistrationEntity, FeaturedEventEntity } from '~entity';
import { MailTransporter, sendEmail } from '~web/helpers/messaging/email';
import { DateTimeHelper } from '~shared';

const _dateTimeHelper = new DateTimeHelper();

/**
 * Sends featured event cancellation messages for a given featured event.
 * @param featuredEvent The featured event that was cancelled.
 * @return A promise that resolves once all messages have been sent.
 */
export function adminSendFeaturedEventCancelledMessages(featuredEvent: FeaturedEventEntity): Promise<any> {
  const promises: Promise<void>[] = [];

  featuredEvent.registrations.forEach((eventRegistration: EventRegistrationEntity) => {
    const eventDateStr: string = _dateTimeHelper.toLocalDateStr(featuredEvent.date, eventRegistration.timezone);
    const eventTimeStr: string = _dateTimeHelper.toLocalTimeStr(featuredEvent.date, eventRegistration.timezone);

    promises.push(
      sendEmail(
        MailTransporter.NOREPLY,
        { name: eventRegistration.fullName, email: eventRegistration.email },
        `FoodWeb Event Cancelled: ${featuredEvent.title}`,
        'featured-event-cancelled',
        { eventRegistration, eventDateStr, eventTimeStr, featuredEvent }
      ).catch(console.error)
    );
  });

  return Promise.all(promises);
}
