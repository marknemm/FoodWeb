import { Injectable } from '@angular/core';
import { confirm } from '@nativescript/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfirmDialogService {

  constructor() {}

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
