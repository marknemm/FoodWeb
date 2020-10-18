import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertActionBase, AlertBase } from './alert-base';
export { AlertLevel, RawAlertMessage } from './alert-base';

export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;

export interface Alert<T = any> extends AlertBase<T> {
  actions?: AlertAction<T>[];
  primaryAction?: AlertAction<T>;
}

export interface AlertAction<T = any> extends AlertActionBase<T> {
  buttonType?: AlertButtonType;
}
