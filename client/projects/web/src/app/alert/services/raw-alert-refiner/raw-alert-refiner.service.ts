import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RawAlertMessage, AlertBody, AlertMessage, AlertLevel } from '~web/alert/interfaces/alert-message';

@Injectable({
  providedIn: 'root'
})
export class RawAlertRefinerService {

  constructor() {}

  /**
   * Refines a given raw alert message.
   * @param rawAlertMessage The raw alert message that is to be refined.
   * @param level The level that shall be assigned to the alert message.
   * @return The refined alert message.
   */
  refineRawAlert(rawAlertMessage: RawAlertMessage, level: AlertLevel): AlertMessage {
    return {
      body: this._deriveAlertBody(rawAlertMessage),
      level
    };
  }

  /**
   * Derives an alert body from a given raw message.
   * @param rawAlertMessage The raw alert message from which to derive the alert body.
   * @return The derived alert body.
   */
  private _deriveAlertBody(rawAlertMessage: RawAlertMessage): AlertBody {
    if (rawAlertMessage instanceof Error || rawAlertMessage instanceof HttpErrorResponse) {
      console.error(rawAlertMessage);
      return this._deriveAlertBodyFromError(rawAlertMessage);
    }
    return rawAlertMessage;
  }

  /**
   * Derives an alert body from a given error, which shall be displayed to the user.
   * @param error The error from which to derive the alert body.
   * @return The derived alert body.
   */
  private _deriveAlertBodyFromError(error: Error | HttpErrorResponse): string {
    if (error instanceof Error) {
      return (error.message ? error.message : 'An unexpected error has occured');
    }
    return this._deriveAlertBodyFromErrorResponse(error);
  }

  /**
   * Derives an alert body from a given HTTP error response.
   * @param alert The HTTP error response from which to derive the alert body.
   * @return The derived alert body.
   */
  private _deriveAlertBodyFromErrorResponse(error: HttpErrorResponse): string {
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
