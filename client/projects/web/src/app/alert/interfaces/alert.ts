import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;
export type AlertConversionSrc = string | Error | HttpErrorResponse;
export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';

export interface Alert<T = any> {
  level: AlertLevel;
  message: string;
  actions?: AlertAction<T>[];
  blocking?: boolean;
  primaryAction?: AlertAction<T>;
  title?: string;
}

export interface AlertAction<T = any> {
  value: T;
  buttonType?: AlertButtonType;
  color?: string;
  focusPrimary?: boolean;
  text?: string;
}
