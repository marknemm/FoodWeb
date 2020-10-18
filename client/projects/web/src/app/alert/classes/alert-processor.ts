import { Observable } from 'rxjs';
import { AlertBase, AlertLevel } from '~web/alert/interfaces/alert-base';

export abstract class AlertProcessor {

  /**
   * Displays a given simple message in a non-blocking/blocking alert UI element.
   * @param message The message content that is to be displayed.
   * @param level The level of the message to display which determines theming of alert UI element.
   * @param blocking Whether or not the message should be blocking. Defaults to false for non-blocking.
   */
  abstract displaySimpleMessage(message: string, level: AlertLevel, blocking?: boolean): void;

  /**
   * Displays a given alert message in a non-blocking/blocking alert UI element.
   * @param alert The alert message that is to be displayed.
   * @param config The optional alert display configuration.
   * @return An observable that emits the alert UI element closes.
   */
  abstract displayAlert<T>(alert: AlertBase, config?: any): Observable<T>;
}
