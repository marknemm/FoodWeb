import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertActionBase } from '~web/alert/interfaces/alert-base';
import { AlertQueueService } from '~web/alert/services/alert-queue/alert-queue.service';
import { ConfirmDialog } from '~web/shared/interfaces/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService implements ConfirmDialog {

  constructor(
    private _alertQueue: AlertQueueService
  ) {}

  /**
   * @override
   * @param message The confirm dialog main message (should be in the form of a question).
   * @param title An optional confirm dialog title.
   * @param confirmTxt An optional confirm button text.
   * @param cancelTxt An optional cancel button text.
   * @return An observable that resolves to the confirm dialog result; true for confirm, false for cancel.
   */
  displayConfirmDialog(message: string, title?: string, confirmTxt?: string, cancelTxt?: string): Observable<boolean> {
    const cancel: AlertActionBase<boolean> = {
      color: 'warn',
      text: cancelTxt ? cancelTxt : 'Cancel',
      value: false,
    };
    const confirm: AlertActionBase<boolean> = {
      focusPrimary: true,
      text: confirmTxt ? confirmTxt : 'Confirm',
      value: true,
    };

    return this._alertQueue.processImmediately({
      message,
      title,
      level: 'info',
      actions: [cancel, confirm],
      blocking: true,
    }, { disableClose: true });
  }
}
