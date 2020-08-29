import { Injectable } from '@angular/core';
import { confirm } from '@nativescript/core';
import { from, Observable } from 'rxjs';
import { ConfirmDialog } from '~web/shared/interfaces/confirm-dialog';

@Injectable({
  providedIn: 'root'
})
export class AppConfirmDialogService implements ConfirmDialog {

  constructor() {}

  /**
   * @override
   * @param message The confirm dialog main message (should be in the form of a question).
   * @param title An optional confirm dialog title.
   * @param confirmTxt An optional confirm button text.
   * @param cancelTxt An optional cancel button text.
   * @return An observable that resolves to the confirm dialog result; true for confirm, false for cancel.
   */
  displayConfirmDialog(message: string, title?: string, confirmTxt?: string, cancelTxt?: string): Observable<boolean> {
    return from(
      confirm({
        title,
        message,
        cancelButtonText: cancelTxt ? cancelTxt : 'Cancel',
        okButtonText: confirmTxt ? confirmTxt : 'Confirm',
        cancelable: false
      })
    );
  }
}
