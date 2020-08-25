import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertAction, AlertService } from '~web/alert/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(
    private _alertService: AlertService
  ) {}

  displayConfirmDialog(message: string, title?: string, confirmTxt?: string, cancelTxt?: string): Observable<any> {
    const cancel: AlertAction<boolean> = {
      text: cancelTxt ? cancelTxt : 'Cancel',
      value: false
    };
    const confirm: AlertAction<boolean> = {
      text: confirmTxt ? confirmTxt : 'Confirm',
      value: true,
      cdkFocusPrimary: true
    };

    return this._alertService.displayAlert({
      message,
      title,
      level: 'info',
      actions: [cancel, confirm],
      blocking: true
    }, { disableClose: true });
  }
}
