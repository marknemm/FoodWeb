import { EventRegistration } from './event-registration';
import { WriteRequest } from '../write-request';
export { EventRegistration };

export interface EventRegistrationRequest extends WriteRequest {
  eventRegistration: EventRegistration;
}
