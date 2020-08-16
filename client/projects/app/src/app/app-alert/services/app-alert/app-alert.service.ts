import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppAlert, AlertBody, AppAlertConfig, AlertLevel } from '~app/app-alert/interfaces/app-alert';
export * from '~app/app-alert/interfaces/app-alert';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService {

  constructor() {}

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param body The body content of the simple message.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displaySimpleMessage(body: AlertBody, level: AlertLevel, blocking = false): void {
    this.displayMessage({ body, level, blocking});
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits the selected alert action when the dialog closes. Emits null if no action was selected.
   */
  displayMessage<T>(message: AppAlert<T>, config: AppAlertConfig<AppAlert<T>> = {}): Observable<T> {
    return of(null);
  }
}
