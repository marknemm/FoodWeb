import { WriteRequest } from '../write-request';
import { EventRegistration } from './event-registration';
export { EventRegistration };

export interface EventRegistrationCreateRequest extends WriteRequest {
  eventRegistration: EventRegistration;
}
