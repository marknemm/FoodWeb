import { PagingParams } from '../notification/notification-read-request';

export interface EventRegistrationReadRequest extends PagingParams {
  eventTitleDate?: string;
}
