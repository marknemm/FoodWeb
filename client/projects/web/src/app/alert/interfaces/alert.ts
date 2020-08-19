import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertLevel } from './simple-alert';
export * from './simple-alert';

export type AlertMessage = string | TemplateRef<any>;
export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;

export interface Alert<T = any> {
  title?: string;
  message: AlertMessage;
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
