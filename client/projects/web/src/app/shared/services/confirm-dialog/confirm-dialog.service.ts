import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertService } from '~web/alert/services/alert/alert.service';
import { ConfirmDialog } from '~web/shared/interfaces/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService implements ConfirmDialog {

  constructor(
    private _alertService: AlertService
  ) {}

  /**
   * @override
   * @param message The confirm dialog main message (should be in the form of a question).
   * @param title An optional confirm dialog title.
   * @param confirmTxt An optional confirm button text.
   * @param cancelTxt An optional cancel button text.
   * @return An observable that resolves to the confirm dialog result; true for confirm, false for cancel.
   */
  displayConfirmDialog(message: string, title?: string, confirmTxt = 'Confirm', cancelTxt = 'Cancel'): Observable<boolean> {
    return this._alertService.displayAlert({
      level: 'info',
      message,
      blocking: true,
      cancelButton: cancelTxt,
      confirmButton: confirmTxt,
      disableBackdropClose: true,
      title,
    });
  }
}
