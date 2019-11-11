import { getRepository } from 'typeorm';
import { EventRegistrationEntity } from '../entity/event-registration.entity';
import { EventRegistrationReadRequest } from '../shared';

export interface EventRegistrationsQueryResult {
  registrations: EventRegistrationEntity[];
  totalCount: number;
}

/**
 * Reads event registrations from the database.
 * @param request The event registrations read request used to perform filtering and paging on registrations to retrieve.
 * @return A promise that resolves to the event registration query result.
 */
export async function readEventRegistrations(request: EventRegistrationReadRequest): Promise<EventRegistrationsQueryResult> {
  const [registrations, totalCount]: [EventRegistrationEntity[], number] = await getRepository(EventRegistrationEntity).findAndCount({
    order: { fullName: 'ASC' }
  });
  return { registrations, totalCount };
}
