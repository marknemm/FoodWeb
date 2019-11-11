import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, ObservableInput } from 'rxjs';

import { AlertService, AlertMessage } from '~web/shared/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private _alertService: AlertService
  ) {
    this.handleError = this.handleError.bind(this);
  }

  handleError(error: Error | HttpErrorResponse, level: 'danger' | 'warn' = 'danger'): ObservableInput<any> {
    const alertMessage: AlertMessage = { body: '', level, blocking: false };
    alertMessage.body = this._deriveMessageBody(error);
    this._alertService.displayMessage(alertMessage);
    console.error(error);
    return EMPTY;
  }

  private _deriveMessageBody(error: Error | HttpErrorResponse): string {
    if (error instanceof Error) {
      return (error.message ? error.message : 'An unexpected error has occured');
    }
    return this._deriveMessageBodyFromResponse(error);
  }

  private _deriveMessageBodyFromResponse(error: HttpErrorResponse): string {
    if (error.error && error.error.message) {
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
