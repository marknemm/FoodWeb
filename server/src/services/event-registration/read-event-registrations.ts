import { getRepository } from 'typeorm';
import { EventRegistrationEntity } from '../../entity/event-registration.entity';
import { QueryResult } from '../../helpers/database/query-builder-helper';
import { EventRegistrationReadRequest } from '../../shared';

/**
 * Reads event registrations from the database.
 * @param request The event registrations read request used to perform filtering and paging on registrations to retrieve.
 * @return A promise that resolves to the event registration query result.
 */
export async function readEventRegistrations(request: EventRegistrationReadRequest): Promise<QueryResult<EventRegistrationEntity>> {
  const [registrations, totalCount]: [EventRegistrationEntity[], number] = await getRepository(EventRegistrationEntity).findAndCount({
    order: { fullName: 'ASC' }
  });
  return { entities: registrations, totalCount };
}
