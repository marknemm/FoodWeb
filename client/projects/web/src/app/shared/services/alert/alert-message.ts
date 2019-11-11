import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export type AlertBody = string | TemplateRef<any>;
export type AlertLevel = 'info' | 'success' | 'warn' | 'danger';
export type AlertButtonType = 'mat-button' | 'mat-raised-button';
export type AlertConfig<T = any> = MatDialogConfig<T> | MatSnackBarConfig<T>;

export interface AlertMessage<T = any> {
  title?: string;
  body: AlertBody;
  level: AlertLevel;
  blocking?: boolean;
  responses?: AlertResponse<T>[];
}

export interface AlertResponse<T = any> {
  text?: string;
  value: T;
  color?: string;
  buttonType?: AlertButtonType;
  cdkFocusPrimary?: boolean;
}
