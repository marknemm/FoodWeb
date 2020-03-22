import { Injectable } from '@angular/core';
import { AlertService } from '~web/shared/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class IeAlertService {

  constructor(
    private _alertService: AlertService
  ) {}

  showIEWarning(): void {
    if (window.document['documentMode']) { // If IE feature exists.
      this._alertService.displayMessage({
        title: 'Internet Explorer Detected',
        body: `
          We have detected that you are using Internet Explorer, which is not supported by FoodWeb.
          Please switch to another browser such as <strong>Microsoft Edge</strong> or <strong>Google Chrome</strong>.
        `,
        level: 'warn',
        blocking: true,
        responses: [{ value: 'Ok', cdkFocusPrimary: true }]
      }, { disableClose: false });
    }
  }
}