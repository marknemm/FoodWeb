import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Alert, AlertConfig, AlertLevel, AlertMessage } from '~web/shared/services/alert/alert';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService implements Alert {

  constructor() {}

  displaySimpleMessage(messageBody: string, level: AlertLevel, blocking?: boolean): void {
    this.displayMessage({ body: messageBody, level, blocking});
  }

  displayMessage<T>(message: AlertMessage<T>, config: AlertConfig<AlertMessage<T>> = {}): Observable<T> {
    // TODO.
    return of(null);
  }
}
