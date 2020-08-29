import { Observable } from 'rxjs';

export interface ConfirmDialog {
  /**
   * Displays a blocking confirm modal dialog.
   */
  displayConfirmDialog(message: string, title?: string, confirmTxt?: string, cancelTxt?: string): Observable<boolean>;
}
