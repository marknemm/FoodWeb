import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertBody, AlertLevel, AlertMessage } from './alert-message';
export * from './alert-message';

export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;

export interface Alert<T = any> extends AlertMessage {
  title?: string;
  body: AlertBody;
  level: AlertLevel;
  blocking?: boolean;
  actions?: AlertAction<T>[];
  primaryAction?: AlertAction<T>;
}

export interface AlertAction<T = any> {
  text?: string;
  value: T;
  color?: string;
  buttonType?: AlertButtonType;
  cdkFocusPrimary?: boolean;
}
