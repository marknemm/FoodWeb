import { Injectable } from '@angular/core';
import { AlertService } from '~web/alert/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class IeAlertService {

  constructor(
    private _alertService: AlertService
  ) {}

  showIEWarning(): void {
    if (document['documentMode']) { // If IE feature exists.
      this._alertService.displayAlert({
        title: 'Internet Explorer Detected',
        message: `
          We have detected that you are using Internet Explorer, which is not supported by FoodWeb.
          Please switch to another browser such as <strong>Microsoft Edge</strong>, <strong>Safari</strong>,
          <strong>Mozilla Firefox</strong>, or <strong>Google Chrome</strong>.
        `,
        level: 'warn',
        blocking: true,
        confirmButton: 'Ok',
      });
    }
  }
}
