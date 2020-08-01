import { Observable } from 'rxjs';
import { AlertConfig, AlertLevel, AlertMessage } from './alert-message';
export * from './alert-message';

/**
 * A common interface for Alert Service functionality.
 */
export interface Alert {
  displaySimpleMessage(messageBody: string, level: AlertLevel, blocking?: boolean): void;
  displayMessage<T>(message: AlertMessage<T>, config?: AlertConfig<AlertMessage<T>>): Observable<T>;
}
