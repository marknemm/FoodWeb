import { HttpErrorResponse } from '@angular/common/http';
import { NEVER, Observable, ObservableInput } from 'rxjs';

/**
 * The level of an `Alert`, which determines its color theme.
 */
export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';

/**
 * Configuration for an `Alert` that is displayable via a service that extends `AlertDisplayer`.
 */
export interface Alert {
  level: AlertLevel;
  message: string;
  blocking?: boolean;
  cancelButton?: string;
  confirmButton?: string;
  cssClass?: string;
  disableBackdropClose?: boolean;
  title?: string;
}

/**
 * Common base funcitonality for all `Alert` display services.
 */
export abstract class AlertDisplayer {

  /**
   * Displays a given simple message in either a non-blocking snackbar or blocking modal dialog.
   * @param message The message content that is to be displayed.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   */
  displayMessage(message: string, level: AlertLevel, blocking = false): void {
    this.displayAlert({ message, level, blocking});
  }

  /**
   * Displays an alert message extracted from a given error in either a non-blocking snackbar or blocking modal dialog.
   * @param error The error containing the alert message that should be displayed.
   * @param level The level of the message to display (determines theming of blocking dialog or non-blocking snackbar).
   * Defaults to `danger`.
   * @param blocking Whether or not the message should be blocking (in a modal dialog). Defaults to false for non-blocking.
   * @return `NEVER` in case this is the callback to a `catchError` rxjs pipe operator.
   */
  displayError(error: Error | HttpErrorResponse, level: AlertLevel = 'danger', blocking = false): ObservableInput<any> {
    this.displayAlert({ message: this._extractErrorMessage(error), level, blocking });
    return NEVER;
  }

  /**
   * Displays a given alert message in either a non-blocking snackbar or blocking modal dialog.
   * @param alert The alert message that is to be displayed.
   * @param config The alert display configuration.
   * @return An observable that emits true if the confirm button was selected on alert dismissal, false otherwise.
   */
  abstract displayAlert(alert: Alert): Observable<boolean>;

  /**
   * Extracts the Alert's message from a given error.
   * @param error The error from which to extract the alert message.
   * @return The extracted alert message.
   */
  protected _extractErrorMessage(error: Error | HttpErrorResponse): string {
    if (error instanceof Error) {
      return (error.message ? error.message : 'An unexpected error has occured');
    }
    // Else dealing with HttpErrorResponse from here on..
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.statusText) {
      return error.statusText;
    }
    return 'An unexpected error has occured';
  }
}
