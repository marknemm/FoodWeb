import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RawAlertMessage, SimpleAlert, AlertLevel } from '~web/alert/interfaces/simple-alert';

@Injectable({
  providedIn: 'root'
})
export class RawAlertRefinerService {

  constructor() {}

  /**
   * Refines a given raw alert message.
   * @param rawAlertMessage The raw alert message that is to be refined.
   * @param level The level that shall be assigned to the alert message.
   * @return The refined simple alert message.
   */
  refineRawAlert(rawAlertMessage: RawAlertMessage, level: AlertLevel): SimpleAlert {
    return {
      message: this._deriveAlertMessage(rawAlertMessage),
      level
    };
  }

  /**
   * Derives an alert message from a given raw message.
   * @param rawAlertMessage The raw alert message from which to derive the alert message.
   * @return The derived alert message.
   */
  private _deriveAlertMessage(rawAlertMessage: RawAlertMessage): string {
    if (rawAlertMessage instanceof Error || rawAlertMessage instanceof HttpErrorResponse) {
      console.error(rawAlertMessage);
      return this._deriveAlertMessageFromError(rawAlertMessage);
    }
    return rawAlertMessage;
  }

  /**
   * Derives an alert message from a given error, which shall be displayed to the user.
   * @param error The error from which to derive the alert message.
   * @return The derived alert message.
   */
  private _deriveAlertMessageFromError(error: Error | HttpErrorResponse): string {
    if (error instanceof Error) {
      return (error.message ? error.message : 'An unexpected error has occured');
    }
    return this._deriveAlertMessageFromErrorResponse(error);
  }

  /**
   * Derives an alert message from a given HTTP error response.
   * @param alert The HTTP error response from which to derive the alert message.
   * @return The derived alert message.
   */
  private _deriveAlertMessageFromErrorResponse(error: HttpErrorResponse): string {
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
