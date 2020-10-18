import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertBase, AlertLevel, RawAlertMessage } from '~web/alert/interfaces/alert-base';

@Injectable({
  providedIn: 'root'
})
export class RawAlertRefinerService {

  /**
   * Refines a given raw alert message.
   * @param rawAlertMessage The raw alert message that is to be refined.
   * @param level The level that shall be assigned to the alert message.
   * @return The refined alert object.
   */
  refineRawAlert(rawAlertMessage: AlertBase | RawAlertMessage, level: AlertLevel): AlertBase {
    return (typeof rawAlertMessage === 'string' || rawAlertMessage instanceof Error || rawAlertMessage instanceof HttpErrorResponse)
      ? { message: this._deriveAlertMessage(rawAlertMessage), level }
      : rawAlertMessage;
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
