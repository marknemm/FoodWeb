import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertResponseService } from '~web/shared/services/alert/alert-response.service';
import { AlertConfig, AlertLevel, AlertMessage, AlertService } from '~web/shared/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AppAlertService extends AlertService {

  constructor(
    protected _alertResponseService: AlertResponseService
  ) {
    super(null, null, _alertResponseService);
  }

  displaySimpleMessage(messageBody: string, level: AlertLevel, blocking?: boolean): void {
    this.displayMessage({ body: messageBody, level, blocking});
  }

  displayMessage<T>(message: AlertMessage<T>, config: AlertConfig<AlertMessage<T>> = {}): Observable<T> {
    // TODO.
    return of(null);
  }
}
