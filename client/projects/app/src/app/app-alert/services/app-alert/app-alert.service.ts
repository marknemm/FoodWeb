import { Injectable } from '@angular/core';
import { Feedback } from 'nativescript-feedback';
import { Observable, of } from 'rxjs';
import { AlertLevel, AppAlert, AppAlertConfig } from '~app/app-alert/interfaces/app-alert';
import { AlertProcessor } from '~web/alert/classes/alert-processor';
export * from '~app/app-alert/interfaces/app-alert';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService extends AlertProcessor {

  constructor(
    private _feedback: Feedback
  ) { super(); }

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The message content to be displayed.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displaySimpleMessage(message: string, level: AlertLevel, blocking?: boolean): void {
    this.displayAlert({ message, level, blocking });
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits the selected alert action when the dialog closes. Emits null if no action was selected.
   */
  displayAlert<T>(alert: AppAlert<T>, config: AppAlertConfig = {}): Observable<T> {
    this._fillDefaultConfig(alert, config);

    switch (alert.level) {
      case 'danger':  this._feedback.error(config);   break;
      case 'info':    this._feedback.info(config);    break;
      case 'success': this._feedback.success(config); break;
      case 'warn':    this._feedback.warning(config); break;
      default:        throw new Error(`Incorrect alert message level given: ${alert.level}`);
    }

    return of(null);
  }

  private _fillDefaultConfig<T>(alert: AppAlert<T>, config: AppAlertConfig): void {
    config.message = config.message ? config.message : alert.message;
    config.title = config.title ? config.title : alert.title;
  }
}
