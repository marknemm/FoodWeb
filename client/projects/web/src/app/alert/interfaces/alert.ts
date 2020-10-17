import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertLevel, SimpleAlert } from './simple-alert';
export * from './simple-alert';

export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;

export interface Alert<T = any> extends SimpleAlert {
  title?: string;
  message: string;
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
