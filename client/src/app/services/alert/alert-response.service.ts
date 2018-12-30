import { Injectable } from '@angular/core';
import { AlertResponse, AlertMessage } from './alert-message';

@Injectable({
  providedIn: 'root'
})
export class AlertResponseService<T = any> {

  constructor() {}

  preprocessResponses(message: AlertMessage): void {
    if (!message.responses) {
      message.responses = [];
    }

    const responses: AlertResponse<T>[] = message.responses;
    for (let i = 0; i < responses.length; i++) {
      const response: AlertResponse<T> = responses[i];
      response.buttonType = (response.buttonType ? response.buttonType : 'mat-button');
      response.text = (response.text ? response.text : response.value.toString());
      response.color = (response.color ? response.color : `alert-${message.level}`);
    }
  }

  getPrimaryResponse(message: AlertMessage): AlertResponse {
    if (message.responses && message.responses.length > 0) {
      const primaryResponse: AlertResponse = message.responses.filter(
        (response: AlertResponse) => response.cdkFocusPrimary
      )[0];
      return (primaryResponse ? primaryResponse : message.responses[0]);
    }
    return null;
  }
}
